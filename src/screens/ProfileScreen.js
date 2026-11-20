import { Alert, View, useWindowDimensions } from "react-native";
import { AppText, AppButton } from "../components/ui";
import { layout } from "../styles/style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import theme from "../styles/theme-dark";
import StarsSvg from "../../assets/header/stars.svg";
import MountainsFrontSvg from "../../assets/header/mountains-front.svg";

import { logoutUser } from "../../library/services/authService";

const { colors, spacing } = theme;

// SVG Image at homescreen, layer goes from back to front
const HEADER_LAYERS = [
  {
    source: require("../../assets/header/sky.png"),
    anchor: "top",
    speed: 0.25,
    fill: true,
  },
  {
    source: <StarsSvg width="100%" height="100%" />,
    aspectRatio: 390 / 157,
    anchor: "top",
    speed: 0.1,
    stretch: false,
  },
  {
    source: require("../../assets/header/mountains-back.png"),
    aspectRatio: 390.62 / 65,
    anchor: "bottom",
    speed: 0.7,
  },
  {
    source: <MountainsFrontSvg width="100%" height="100%" />,
    aspectRatio: 390 / 43,
    anchor: "bottom",
    speed: 1,
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navHeaderHeight = useHeaderHeight();
  const headerHeight = width * (219.071 / 390) + insets.top;

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
    <ParallaxHeaderScrollView
      layers={HEADER_LAYERS}
      headerHeight={headerHeight}
      bodyColor={colors.background}
      bottomPadding={spacing.md}
      headerContent={<></>}
    >
      <View style={layout.content}>
        <AppButton title="Log Out" onPress={confirmLogout} />
      </View>
    </ParallaxHeaderScrollView>
  );
}