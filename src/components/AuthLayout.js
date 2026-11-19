import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { AppText } from "../components/ui";

import TwinkleStars, { starPath } from "./TwinkleStars";
import theme from "../styles/theme-dark";

const { colors, spacing } = theme;

function Sparkle() {
  return (
    <Svg width={32} height={32} viewBox="0 0 26 26">
      <Path d={starPath(10, 15, 9.5, 0, 0.1)} fill={colors.primary} />
      <Path d={starPath(20.5, 5.5, 4.5, 0, 0.1)} fill={colors.primary} />
    </Svg>
  );
}

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

export default function AuthLayout({ children }) {
  const keyboardVisible = useKeyboardVisible();
  const wordmarkOpacity = useSharedValue(1);
  useEffect(() => {
    wordmarkOpacity.value = withTiming(keyboardVisible ? 0 : 1, { duration: 200 });
  }, [keyboardVisible, wordmarkOpacity]);
  const wordmarkStyle = useAnimatedStyle(() => ({ opacity: wordmarkOpacity.value }));

  return (
    <View style={styles.root}>
      <TwinkleStars style={styles.stars} />

        <Animated.View pointerEvents="none" style={[styles.wordmark]}>
          <Sparkle />
          <AppText variant="brand">Stargaze.</AppText>
        </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.slot}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children ?? (<PlaceholderCard />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  stars: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  wordmark: {
    top: 296,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  scroll: {
    flex: 1,
    paddingBottom: 50,
  },
  slot: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});