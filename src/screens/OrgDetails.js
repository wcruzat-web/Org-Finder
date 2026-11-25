import { View, Image, StyleSheet } from "react-native";
import { TabScroll, AppText, Avatar, AppButton, Pill } from "../components/ui";
import { layout, card } from "../styles/style";

import HalftoneCorner from "../components/cards/HalftoneCorner";
import DefaultBanner from "../../assets/banner-placeholder.png";
import AnnouncementCard from "../components/cards/AnnouncementCard";

export default function OrgDetails({ route, navigation }) {
  // Receive organization data
  const { org } = route.params;

  const getImageSource = (image) =>
    typeof image === "string" ? { uri: image } : image;

  return (
    <TabScroll contentStyle={layout.screen} useNavPadding={false}>
      <HalftoneCorner
        width="75%"
        height="50%"
        style={{ position: "absolute", top: -100, right: 0 }}
      />
      {/* Banner kontiner */}
      <View style={layout.banner}>
        {/* Ba is nner picshur */}
        <Image
          source={org.banner ? getImageSource(org.banner) : DefaultBanner}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {/* Frufayl */}
        <View style={layout.profileSection}>
          <Avatar name={org.name} image={org.profile} size="profile" />
        </View>
      </View>

      <View style={[layout.content, layout.stack]}>
        {/* Name and filter tag continer */}
        <View style={layout.columnCenter}>
          <AppText variant="headline" align="center">
            {org.name}
          </AppText>
          <Pill label={org.category} tone="muted" />
        </View>

        {/* Member Count + Button */}
        <View style={card.footer}>
          <AppText variant="caption" tone="primary">
            {org.memberCount} Members
          </AppText>
          {org.status === "joined" ? (
            <View style={layout.columnCenter}>
              <AppButton
                title="Joined"
                variant="secondary"
                size="sm"
                fullWidth={false}
                disabled
              />
            </View>
          ) : (
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
          )}
        </View>

        {/* Description */}
        <View style={layout.stackInside}>
          <AppText variant="label">About</AppText>
          <AppText variant="caption" style={card.description}>
            {org.description}
          </AppText>
        </View>

        <View style={layout.stackInside}>
          <AppText variant="label">Announcements</AppText>
          {/* forda Announcements */}
          <AnnouncementCard
            title="Organization Meeting"
            time="2 hours ago"
            message="We would like to inform everyone that our monthly organization meeting will be held this Friday at 3 PM."
          />
        </View>
      </View>
    </TabScroll>
  );
}
