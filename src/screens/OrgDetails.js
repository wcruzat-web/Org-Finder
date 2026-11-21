import { View } from "react-native";
import { TabScroll, AppText, Avatar, AppButton } from "../components/ui";
import { layout, card } from "../styles/style";

import HalftoneCorner from "../components/cards/HalftoneCorner";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export default function OrgDetails({ route, navigation }) {
  // Receive organization data
  const { org } = route.params;

  return (
    <TabScroll contentStyle={layout.screen}>
      <HalftoneCorner
        width="75%"
        height="50%"
        style={{ position: "absolute", top: -100, right: 0 }}
      />
      <View style={card.header}>
        <Avatar name={org.name} size="lg" />

        <View style={card.headerText}>
          <AppText variant="headline">{org.name}</AppText>
          <AppText variant="caption">{org.category}</AppText>
        </View>
      </View>
      <View style={card.footer}>
        <AppText variant="caption" tone="primary">
          {org.memberCount} Members
        </AppText>
        { org.status === "joined" ? 
        <View style={layout.columnCenter}>
          <AppButton
            title="Joined"
            variant="secondary"
            size="sm"
            fullWidth={false}
            disabled
          />
        </View>
        :
        <View style={layout.columnCenter}>
          <AppButton
            title="Apply for Membership"
            size="sm"
            fullWidth={false}
            onPress={null}
          />
          <AppText variant="tag" tone="primary">
            {org.slotCount} Slots Available
          </AppText>
        </View>
        }
      </View>
      <AppText variant="caption" style={card.description}>
        {org.description}
      </AppText>
      <View>
        {/* forda Announcements */}
      </View>
    </TabScroll>
  );
}
