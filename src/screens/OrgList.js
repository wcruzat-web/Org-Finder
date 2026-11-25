import { useState, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { OrgCard } from "../components/cards";
import { TabScroll, AppInput, SegmentedTabs } from "../components/ui";

import { layout } from "../styles/style.js";

import supabase from "../../library/supabase.js";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "vacancies", label: "Vacancies" },
  { key: "applications", label: "Applications" },
];

export default function OrgList() {
  const navigation = useNavigation();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStudentCourse = async () => {
    try {
      setErrorMessage("");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      if (!user) throw new Error("No user found");

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("course")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError) throw accountError;

      await fetchOrganizations(account.course);
    } catch (error) {
      setErrorMessage("Error fetching student course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async (course) => {
    try {
      setLoading(true);
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .or(`course_eligibility.eq.all,eligible_courses.cs.{${course}}`);

      if (orgError) throw orgError;

      const { data: countData, error: countError } = await supabase.rpc(
        "get_organization_member_counts",
      );

      if (countError) throw countError;

      const organizationWithCounts = orgData.map((org) => {
        const count = countData.find((c) => c.organization_id === org.id);
        return { ...org, memberCount: count?.member_count ?? 0 };
      });

      // console.log("Eligible organizations:", orgData);
      setOrganizations(organizationWithCounts);
    } catch (error) {
      setErrorMessage("Error fetching organizations: " + error.message);
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // search organizations by name
  const filteredOrganizations = organizations.filter((org) =>
    org.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    getStudentCourse();
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
        <SegmentedTabs tabs={FILTERS} activeKey={filter} onChange={setFilter} />
      </View>

      <View style={layout.content}>
        {filteredOrganizations.map((org) => (
          <OrgCard
            key={org.id}
            name={org.name}
            tags={[org.category, org.subcategory]}
            description={org.description}
            memberCount={org.memberCount}
            onPress={() => navigation.navigate("OrgDetail", { org })}
          />
        ))}
      </View>
    </TabScroll>
  );
}
