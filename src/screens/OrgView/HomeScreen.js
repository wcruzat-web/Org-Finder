import { View, Image } from "react-native";
import { TabScroll, AppText, Avatar, AppButton, Pill } from "../../components/ui";
import { layout, card } from "../../styles/style";

import DefaultBanner from "../../../assets/banner-placeholder.png";
import { AnnouncementCard } from "../../components/cards";

export default function HomeScreen() {

  return (
    <TabScroll contentStyle={layout.screen} useNavPadding={false} >
      {/* Banner kontiner */}
      <View style={layout.banner}>
        {/* Ba is nner picshur */}
        <Image
          source={DefaultBanner}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {/* Frufayl */}
        <View style={layout.profileSection}>
          <Avatar name={null} image={null} size="profile" />
        </View>
      </View>

      <View style={[layout.content, layout.stack]}>
        {/* Name and filter tag continer */}
        <View style={layout.columnCenter}>
          <AppText variant="headline" align="center">
            Organization Name
          </AppText>
          <Pill label="Non-Academic" tone="muted" />
        </View>

        {/* Member Count + Button */}
        <View style={card.footer}>
          <AppText variant="caption" tone="primary">
            99 Members
          </AppText>
        </View>

        {/* Description */}
        <View style={layout.stackInside}>
          <AppText variant="label">About</AppText>
          <AppText variant="caption" style={card.description}>
            Org description goes here.
          </AppText>
        </View>

        <View style={layout.stackInside}>
          <AppText variant="label">Announcements</AppText>
          {/* forda Announcements */}
          <AppButton variant="composer" title="Make an announcement..." onPress={null} />
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
