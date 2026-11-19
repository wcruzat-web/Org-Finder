import React, { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import Header from "../components/Header";
import theme, { spacing } from "../styles/theme-dark";
import StarsSvg from "../../assets/header/stars.svg";
import MountainsFrontSvg from "../../assets/header/mountains-front.svg";

import supabase from "../../library/supabase.js";

const { colors } = theme;

const GREETINGS = [
  "Hello",
  "Hi",
  "Hey",
  "Greetings",
  "Welcome Back",
  "Good to see you",
  "Merry Christmas",
];

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navHeaderHeight = useHeaderHeight();
  const headerHeight = width * (219.071 / 390) + insets.top;

  const [fullName, setFullName] = React.useState("");
  const [greeting, setGreeting] = React.useState("");

  useEffect(() => {
    const randomGreeting =
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomGreeting);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
          .from("accounts")
          .select("full_name")
          .eq("auth_user_id", user.id)
          .single();

        if (error) throw error;

        setFullName(data.full_name);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <ParallaxHeaderScrollView
      layers={HEADER_LAYERS}
      headerHeight={headerHeight}
      bodyColor={colors.background}
      bottomPadding={spacing.md}
      headerContent={
        <>
          <View style={[styles.welcome, { paddingTop: navHeaderHeight + 12 }]}>
            <Text style={styles.greeting}>
              {greeting}, {fullName ? fullName.trim().split(/\s+/)[0] : "User"}!
            </Text>
            <Text style={styles.subtitle}>
              What would you like to do today?
            </Text>
          </View>
        </>
      }
    >
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Browse organizations</Text>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>Organization {i + 1}</Text>
          </View>
        ))}
      </View>
    </ParallaxHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  welcome: { paddingHorizontal: 16, marginTop: 12 },
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
});
