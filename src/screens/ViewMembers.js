import { useState } from "react";
import { View } from "react-native";
import { TabScroll, AppInput, SegmentedTabs } from "../components/ui";
import { MemberCard } from "../components/cards";
import { layout } from "../styles/style";

const FILTERS = [
  { key: "members", label: "Members" },
  { key: "officers", label: "Officers" },
];

export default function ViewMembers(){
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("members");

  return(
    <TabScroll >
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

        {/* If self */}
        <MemberCard name="Me, Myself and I" course="BS Computer Science" isSelf />

        {/* If normal member */}
        <MemberCard name="Hwang Hyunjin" course="BS Computer Science" />

        {/* If officer */}
        <MemberCard name="Yu Jimin" course="BS Computer Science" isOfficer />
      </View>
    </TabScroll>
  )
}