import { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { OrgCard } from "../components/cards";
import { layout } from "../styles/style";

import supabase from "../../library/supabase.js";
export default function OrgList() {
  const tags = ["Non-Academic", "Performing"];
  const status = ["open", "closing", "pending", "joined"];

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .or(`course_eligibility.eq.all,eligible_courses.cs.{${course}}`);

      if (error) throw error;

      console.log("Eligible organizations:", data);
      setOrganizations(data);

      setOrganizations(data);
    } catch (error) {
      setErrorMessage("Error fetching organizations: " + error.message);
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentCourse();
  }, []);

  return (
    <ScrollView style={layout.offsetNavbar}>
      <View style={layout.content}>
        {organizations.map((org) => (
          <OrgCard
            key={org.id}
            name={org.name}
            tags={[org.category, org.subcategory]}
            description={org.description}
            status={status[1]}
            memberCount={org.memberCount}
          />
        ))}
      </View>
    </ScrollView>
  );
}
