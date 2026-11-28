import { useState } from "react";
import { View } from "react-native";
import { TabScroll, AppInput, SegmentedTabs } from "../../components/ui";
import { MemberCard } from "../../components/cards";
import { layout } from "../../styles/style";

const FILTERS = [
  { key: "members", label: "Members" },
  { key: "applicants", label: "Applicants" },
];

export default function MemberList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("members");

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
        {/* Member Cards */}

        {/* If normal member */}
        <MemberCard name="Hwang Hyunjin" course="BS Computer Science" />

        {/* For Applicants, di dapat visible initially. Makikita lang if clinick yung Applicants Tab  */}
        <MemberCard
          variant="applicant"
          name="Kim Minjeong"
          course="BS Computer Science"
          appliedAt="2hrs ago"
          response="For I, For I, For I Am the storm."
          onConfirm={() => console.log("Application Confirmed.")}
          onReject={() => console.log("Application Rejected.")}
        />
      </View>
    </TabScroll>
  );
}
