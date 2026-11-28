import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import {
  TabScroll,
  AppInput,
  SegmentedTabs,
  AppText,
} from "../../components/ui";
import { MemberCard } from "../../components/cards";
import { layout } from "../../styles/style";
import supabase from "../../../library/supabase";
const FILTERS = [
  { key: "members", label: "Members" },
  { key: "applicants", label: "Applicants" },
];

function formatAppliedAt(date) {
  if (!date) return "";

  const elapsed = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return `${Math.floor(days / 30)}mo ago`;
}

export default function MemberList({ organization }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("members");
  const [members, setMembers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization?.id) {
      setMembers([]);
      setApplicants([]);
      setLoading(false);
      return;
    }

    fetchOrganizationPeople();
  }, [organization?.id]);

  const fetchOrganizationPeople = async () => {
    setLoading(true);

    try {
      const [membersResult, applicantsResult] = await Promise.all([
        supabase
          .from("organization_members")
          .select(
            `
            id,
            student:accounts!organization_members_student_id_fkey (
              id,
              full_name,
              course
            )
          `,
          )
          .eq("organization_id", organization.id)
          .is("left_at", null),

        supabase
          .from("applications")
          .select(
            `
            id,
            message,
            submitted_at,
            student:accounts!applications_student_id_fkey (
              id,
              full_name,
              course
            )
          `,
          )
          .eq("organization_id", organization.id)
          .eq("status", "pending")
          .order("submitted_at", { ascending: false }),
      ]);

      if (membersResult.error) throw membersResult.error;
      if (applicantsResult.error) throw applicantsResult.error;

      setMembers((membersResult.data ?? []).filter((item) => item.student));

      setApplicants(
        (applicantsResult.data ?? []).filter((item) => item.student),
      );
    } catch (error) {
      console.error(
        "error fetching organization members and applicants:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((item) =>
    item.student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredApplicants = applicants.filter((item) =>
    item.student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleApplicationUpdate = async (applicationId, status) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw userError ?? new Error("Unable to identify the logged-in user.");
      }

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (accountError || !account) {
        throw accountError ?? new Error("Unable to identify the account.");
      }

      const { error } = await supabase
        .from("applications")
        .update({
          status,
          status_updated_by: account.id,
          status_updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId)
        .eq("status", "pending");

      if (error) throw error;

      setApplicants((current) =>
        current.filter((item) => item.id !== applicationId),
      );

      if (status === "accepted") {
        await fetchOrganizationPeople();
      }
    } catch (error) {
      console.error(`error ${status}ing application:`, error);
    }
  };

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
        {loading ? (
          <ActivityIndicator />
        ) : filter === "members" ? (
          filteredMembers.length > 0 ? (
            filteredMembers.map((item) => (
              <MemberCard
                key={item.id}
                name={item.student.full_name}
                course={item.student.course}
              />
            ))
          ) : (
            <AppText variant="caption" tone="disabled">
              No members found.
            </AppText>
          )
        ) : filteredApplicants.length > 0 ? (
          filteredApplicants.map((item) => (
            <MemberCard
              key={item.id}
              variant="applicant"
              name={item.student.full_name}
              course={item.student.course}
              appliedAt={formatAppliedAt(item.submitted_at)}
              response={item.message}
              onConfirm={() => handleApplicationUpdate(item.id, "accepted")}
              onReject={() => handleApplicationUpdate(item.id, "rejected")}
            />
          ))
        ) : (
          <AppText variant="caption" tone="disabled">
            No pending applicants found.
          </AppText>
        )}
      </View>
    </TabScroll>
  );
}
