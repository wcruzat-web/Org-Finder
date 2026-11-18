import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useFonts } from "expo-font";
import { Cause_600SemiBold } from "@expo-google-fonts/cause";
import {
  Overlock_400Regular,
  Overlock_700Bold,
} from "@expo-google-fonts/overlock";

import TwinkleStars, { starPath } from "./TwinkleStars";

/* -------------------------------------------------------------------------- */
/*  Tunables                                                                  */
/* -------------------------------------------------------------------------- */

// Same palette Login.js already uses, so the screens match.
const COLORS = {
  background: "#2D3047",
  gold: "#DDB68E",
  white: "#F5F1F0",
  gray: "#A7A8B5",
  onGold: "#2D3047",
};

// Fonts are a guess from the Figma screenshot. Swap the names here to change them.
const FONTS = {
  display: "Cause_600SemiBold",
  body: "Overlock_400Regular",
  bodyBold: "Overlock_700Bold",
};

// Left/right space around the swappable content (Login.js already uses 28).
const SIDE_PADDING = 28;

// Space under the swappable content.
const BOTTOM_PADDING = 24;

// Where the "Stargaze." wordmark sits, as a share of the screen height.
const WORDMARK_TOP = "34%";

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

// The little sparkle pair that sits before the wordmark.
function Sparkle() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Path d={starPath(10, 15, 9.5, 0, 0.1)} fill={COLORS.gold} />
      <Path d={starPath(20.5, 5.5, 4.5, 0, 0.1)} fill={COLORS.gold} />
    </Svg>
  );
}

// True while the keyboard is open.
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, () => setVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return visible;
}

// TEMPORARY. Stands in for the login/signup content so you can judge the stars.
// It is only shown when AuthLayout is given no children.
function PlaceholderCard() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Find the right organization for your needs.</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </Pressable>
      <Text style={styles.link}>Other sign in options</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*  The layout                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Shared frame for the login and signup screens. The animated stars and the
 * wordmark stay mounted; only `children` (the Auth Container) changes.
 *
 * Render it once in AuthNavigator and put the current page inside it.
 */
export default function AuthLayout({ children }) {
  const [fontsLoaded] = useFonts({
    Cause_600SemiBold,
    Overlock_400Regular,
    Overlock_700Bold,
  });

  // The wordmark fades out while the keyboard is open, so a tall form never
  // sits on top of it.
  const keyboardVisible = useKeyboardVisible();
  const wordmarkOpacity = useSharedValue(1);
  useEffect(() => {
    wordmarkOpacity.value = withTiming(keyboardVisible ? 0 : 1, { duration: 200 });
  }, [keyboardVisible, wordmarkOpacity]);
  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));

  return (
    <View style={styles.root}>
      {/* Layer 1: the animated stars, pinned to the top. */}
      <TwinkleStars style={styles.stars} />

      {/* Layer 2: the wordmark. */}
      {fontsLoaded ? (
        <Animated.View pointerEvents="none" style={[styles.wordmark, wordmarkStyle]}>
          <Sparkle />
          <Text style={styles.wordmarkText}>Stargaze.</Text>
        </Animated.View>
      ) : null}

      {/* Layer 3: the swappable content, hugging the bottom. It scrolls only
          when it is taller than the space available (e.g. keyboard open). */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.slot}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children ?? (fontsLoaded ? <PlaceholderCard /> : null)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  stars: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  wordmark: {
    position: "absolute",
    top: WORDMARK_TOP,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  wordmarkText: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.gold,
  },
  scroll: {
    flex: 1,
  },
  slot: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: SIDE_PADDING,
    paddingBottom: BOTTOM_PADDING,
  },

  // Placeholder only
  placeholder: {
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: COLORS.white,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  button: {
    alignSelf: "stretch",
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.onGold,
  },
  link: {
    marginTop: 14,
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.gray,
    textDecorationLine: "underline",
  },
});