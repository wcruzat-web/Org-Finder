import { useState, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { OrgCard } from "../components/cards";
import { TabScroll, AppInput } from "../components/ui";

import { layout } from "../styles/style.js";
import supabase from "../../library/supabase.js";

export default function MyOrgsList() {
  const navigation = useNavigation();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMyOrganizations = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // get logged-in student
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("No user found.");

      // get student's account id
      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError) throw accountError;

      // get current active semester
      const today = new Date().toISOString().slice(0, 10);

      const { data: semester, error: semesterError } = await supabase
        .from("semesters")
        .select("id")
        .lte("starts_on", today)
        .gte("ends_on", today)
        .order("starts_on", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (semesterError) throw semesterError;

      // no active semester means no current memberships
      if (!semester) {
        setOrganizations([]);
        return;
      }

      // get memberships belonging to this student in the active semester
      const { data: memberships, error: membershipError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("student_id", account.id)
        .eq("semester_id", semester.id)
        .is("left_at", null);

      if (membershipError) throw membershipError;

      const organizationIds = [
        ...new Set(memberships.map((membership) => membership.organization_id)),
      ];

      // no joined organizations
      if (organizationIds.length === 0) {
        setOrganizations([]);
        return;
      }

      // fetch only the organizations the student has joined
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .in("id", organizationIds);

      if (orgError) throw orgError;

      // get current member counts
      const { data: countData, error: countError } = await supabase.rpc(
        "get_organization_member_counts",
      );

      if (countError) throw countError;

      const organizationWithCounts = orgData.map((org) => {
        const count = countData.find(
          (item) => String(item.organization_id) === String(org.id),
        );

        return {
          ...org,
          memberCount: Number(count?.member_count ?? 0),
        };
      });

      setOrganizations(organizationWithCounts);
    } catch (error) {
      console.error("error fetching joined organizations:", error);
      setErrorMessage("Error fetching your organizations: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // search joined organizations by name
  const filteredOrganizations = organizations.filter((org) =>
    org.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    fetchMyOrganizations();
  }, []);

  return (
    <TabScroll>
      <View style={layout.content}>
        <AppInput
          variant="search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => {}}
        />
      </View>

      <View style={layout.content}>
        {loading
          ? null
          : errorMessage
            ? null
            : filteredOrganizations.length === 0
              ? null
              : filteredOrganizations.map((org) => (
                  <OrgCard
                    key={org.id}
                    name={org.name}
                    tags={[org.category, org.subcategory].filter(Boolean)}
                    description={org.description}
                    memberCount={org.memberCount}
                    onPress={() => navigation.navigate("OrgDetail", { org })}
                  />
                ))}
      </View>
    </TabScroll>
  );
}
