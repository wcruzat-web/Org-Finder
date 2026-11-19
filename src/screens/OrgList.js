import { View, ScrollView } from "react-native";
import { OrgCard } from "../components/cards";
import { layout } from "../styles/style";

export default function OrgList() {
  const tags = ["Non-Academic", "Performing"];
  const status = ["open", "closing", "pending", "joined"];

  return (
    <ScrollView style={layout.offsetNavbar}>
      <View style={layout.content}>
        {Array.from({ length: 6 }).map((_, i) => (
          <OrgCard
            key={i}
            name="Organization Name"
            tags={tags}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            status={status[i]}
            memberCount={99}
          />
        ))}
      </View>
    </ScrollView>
  );
}
