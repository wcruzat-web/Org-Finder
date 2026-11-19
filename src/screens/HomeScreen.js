import React, { useEffect } from "react";
import { TouchableOpacity, View, useWindowDimensions } from "react-native";
import { AppInput, AppText } from "../components/ui";
import { OrgCard } from "../components/cards";
import { layout } from "../styles/style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import theme from "../styles/theme-dark";
import StarsSvg from "../../assets/header/stars.svg";
import MountainsFrontSvg from "../../assets/header/mountains-front.svg";

import supabase from "../../library/supabase";

const { colors, spacing } = theme;

const GREETINGS = [
  "Hello",
  "Hi",
  "Hey",
  "Greetings",
  "Welcome Back",
  "Good to see you",
  "Merry Christmas",
];

const SUBTITLE = [
  "What would you like to do today?",
  "What's the constellation today?",
  "How have you been?",
  "Feeling fancy today?",
  "Nothing beats a morning with a cup of coffee.",
  "Friendly Reminder, You matter."
]

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const navHeaderHeight = useHeaderHeight();
  const headerHeight = width * (219.071 / 390) + insets.top;

  const [fullName, setFullName] = React.useState("");
  const [greeting, setGreeting] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const tags = ["Non-Academic", "Performing"];

  useEffect(() => {
    const randomGreeting =
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomGreeting);

    const randomSubtitle =
      SUBTITLE[Math.floor(Math.random() * SUBTITLE.length)];
    setSubtitle(randomSubtitle);
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
          <View style={[layout.gutter, { paddingTop: navHeaderHeight + 12 }]}>
            <AppText variant="headline">{greeting}, {fullName ? fullName.trim().split(/\s+/)[0] : "User"}!</AppText>
            <AppText variant="subtitle">{subtitle}</AppText>
          </View>
        </>
      }
    >
      <View style={layout.content}>
        <AppInput />
      </View>
      <View style={layout.content}>
        <AppText variant="heading">Recommended for you</AppText>
        <OrgCard 
        variant="featured"
        name="Organization Name"
        tags={tags}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        tag="Featured"
        slots={99}
        />
      </View>
      <View style={layout.content}>
        <View style={layout.row}>
          <AppText variant="heading">Browse organizations</AppText>
          <TouchableOpacity onPress={null}>
            <AppText variant="link">See All</AppText>
          </TouchableOpacity>
        </View>
        <OrgCard
        name="Organization Name"
        tags={tags}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        status="Open"
        memberCount={99} />
      </View>
    </ParallaxHeaderScrollView>
  );
}