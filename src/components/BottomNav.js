import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../styles/theme-dark";
import { bottomNav, bottomNavColors, bottomNavMetrics } from "../styles/style";

const { colors, spacing } = theme;



function NavItem({ tab, active, onPress }) {
  const { Icon, label } = tab;

  // fade: native-driven (icon crossfade). tint: JS-driven (label color).
  const fade = useRef(new Animated.Value(active ? 1 : 0)).current;
  const tint = useRef(new Animated.Value(active ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(tint, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [active, fade, tint]);

  const handlePressIn = () =>
    Animated.spring(press, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
  const handlePressOut = () =>
    Animated.spring(press, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  const inactiveOpacity = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const labelColor = tint.interpolate({
    inputRange: [0, 1],
    outputRange: [bottomNavColors.inactive, bottomNavColors.active],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={[bottomNav.item, { transform: [{ scale: press }] }]}
      >
        <View style={bottomNav.iconWrap}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: inactiveOpacity }]}
          >
            <Icon color={colors.textSecondary} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
            <Icon color={colors.surface} />
          </Animated.View>
        </View>
        <Animated.Text
          style={[bottomNav.label, { color: labelColor }]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export default function BottomNav({
  tabs,
  activeKey,
  defaultKey = "discover",
  onChange,
}) {
  const insets = useSafeAreaInsets();

  const [internalKey, setInternalKey] = useState(defaultKey);
  const currentKey = activeKey ?? internalKey;
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.key === currentKey),
  );

  const [trackWidth, setTrackWidth] = useState(0);
  const indicatorIndex = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(indicatorIndex, {
      toValue: activeIndex,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, indicatorIndex]);

  const handlePress = (key) => {
    if (activeKey === undefined) setInternalKey(key);
    onChange?.(key);
  };

  // Tabs are spread with space-between, so the pill slides by this step per tab
  const step =
    trackWidth > 0
      ? (trackWidth - bottomNavMetrics.itemWidth) / (tabs.length - 1)
      : 0;
  const indicatorX = indicatorIndex.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => i * step),
  });

  return (
    <View
      style={[bottomNav.outer, { paddingBottom: insets.bottom + spacing.sm }]}
    >
      <View style={bottomNav.pill}>
        <View
          style={bottomNav.track}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          accessibilityRole="tablist"
        >
          {trackWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                bottomNav.indicator,
                { transform: [{ translateX: indicatorX }] },
              ]}
            />
          )}
          {tabs.map((tab) => (
            <NavItem
              key={tab.key}
              tab={tab}
              active={tab.key === currentKey}
              onPress={() => handlePress(tab.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}