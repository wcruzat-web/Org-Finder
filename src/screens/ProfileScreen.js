import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import Header from "../components/Header";
import theme, { spacing } from "../styles/theme-dark";
import StarsSvg from "../../assets/header/stars.svg";
import MountainsFrontSvg from "../../assets/header/mountains-front.svg";

import { logoutUser } from "../../library/services/authService.js";

const { colors } = theme;

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

export default function ProfileScreen({ onLogout }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navHeaderHeight = useHeaderHeight();
  const headerHeight = width * (219.071 / 390) + insets.top;

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logoutUser();

      Alert.alert("Logged Out", "You have successfully logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxHeaderScrollView
      layers={HEADER_LAYERS}
      headerHeight={headerHeight}
      bodyColor={colors.background}
      bottomPadding={0}
      headerContent={
        <>
          <View
            style={[styles.welcome, { paddingTop: navHeaderHeight + 12 }]}
          ></View>
        </>
      }
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging Out..." : "Logout"}
        </Text>
      </TouchableOpacity>
    </ParallaxHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  welcome: { paddingHorizontal: 16 },
  greeting: { color: colors.textPrimary, fontSize: 30, fontWeight: "700" },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
  content: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    height: 110,
  },
  cardText: { color: colors.textPrimary, fontSize: 16 },
  button: {
    height: 50,
    marginHorizontal: spacing["2xl"],
    backgroundColor: "#DDB68E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#2D3047",
    fontWeight: "600",
  },
});
