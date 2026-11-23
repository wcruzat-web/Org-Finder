import { Alert, View, Image } from "react-native";
import { AppText, AppButton, TabScroll, Avatar } from "../components/ui";
import { layout } from "../styles/style";

import DefaultBanner from "../../assets/banner-placeholder.png";

import { logoutUser } from "../../library/services/authService";

export default function ProfileScreen() {

  const getImageSource = (image) =>
    typeof image === "string" ? { uri: image } : image;

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
          <Avatar size="profile" />
        </View>
      </View>

      <View style={layout.content}>
        {/* Name and filter tag continer */}
        <View style={layout.columnCenter}>
          <AppText variant="headline" align="center">User Name</AppText>
        </View>

        <View>
          <AppButton title="Log Out" onPress={confirmLogout} />
        </View>
      </View>
    </TabScroll>
  );
}