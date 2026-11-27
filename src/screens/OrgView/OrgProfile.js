import { Alert, View, Image } from "react-native";
import {
  TabScroll,
  AppText,
  Avatar,
  AppButton,
  Pill,
} from "../../components/ui";
import SwitchCard from "../../components/cards/SwitchCard";
import { layout, card } from "../../styles/style";
import { logoutUser } from "../../../library/services/authService";

import DefaultBanner from "../../../assets/banner-placeholder.png";
import { useNavigation } from "@react-navigation/native";

export default function OrgProfile() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logoutUser();

      Alert.alert("Logged Out", "You have successfully logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
      return;
    }
  };

  const confirmLogout = async () => {
    Alert.alert("Menu", "Log out of OrgFinder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  return (
    <TabScroll contentStyle={layout.screen} useNavPadding={false}>
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

        {/* Description */}
        <View style={layout.stackInside}>
          <AppText variant="label">About</AppText>
          <AppText variant="caption" style={card.description}>
            Org description goes here.
          </AppText>
        </View>

        {/* Settings and Switch Account */}
        <View style={layout.stack}>
          <View style={[card.base, card.default, layout.stackInside]}>
            <AppText variant="bodySmall">Edit Info</AppText>
          </View>

          <View style={[card.base, card.default, layout.stackInside]}>
            <View style={layout.stackInside}>
              <AppText variant="bodySmall">Switch Account</AppText>
              <SwitchCard
                name="Back to Account" // Replace with user's name
                onPress={() => navigation.navigate("MainTabs")}
              />
            </View>
          </View>

          <AppButton title="Log Out" onPress={confirmLogout} />
        </View>
      </View>
    </TabScroll>
  );
}
