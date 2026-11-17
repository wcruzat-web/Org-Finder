// src/components/BottomNav.js
//
// Floating pill nav bar from the Figma "Navigation" component (358 x 68).
// Works controlled (activeKey + onChange) or uncontrolled (defaultKey).
// Keys match lowercase route names: Discover, OrgLists, Notification, Profile.

import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../styles/theme-dark";
import {
    HomeIcon,
    OrgListIcon,
    BellIcon,
    ProfileIcon,
} from "../../assets/icons/NavIcons";

const { colors, spacing, fontSizes } = theme;

const TABS = [
    { key: "discover", label: "Discover", Icon: HomeIcon },
    { key: "orglists", label: "Org Lists", Icon: OrgListIcon },
    { key: "notification", label: "Notification", Icon: BellIcon },
    { key: "profile", label: "Profile", Icon: ProfileIcon },
];

// Sizes from Figma
const ITEM_W = 75;
const ITEM_H = 48;
const BORDER = 2;
const RADIUS = 64; // fully rounded pill (Figma: spacing/64, not in the theme)
const FONT_BOLD = "Overlock_700Bold";

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
        outputRange: [colors.textSecondary, colors.surface],
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
                style={[styles.item, { transform: [{ scale: press }] }]}
            >
                <View style={styles.iconWrap}>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: inactiveOpacity },
                        ]}
                    >
                        <Icon color={colors.textSecondary} />
                    </Animated.View>
                    <Animated.View
                        style={[StyleSheet.absoluteFill, { opacity: fade }]}
                    >
                        <Icon color={colors.surface} />
                    </Animated.View>
                </View>
                <Animated.Text
                    style={[styles.label, { color: labelColor }]}
                    numberOfLines={1}
                >
                    {label}
                </Animated.Text>
            </Animated.View>
        </Pressable>
    );
}

export default function BottomNav({
    activeKey,
    defaultKey = "discover",
    onChange,
}) {
    const insets = useSafeAreaInsets();

    const [internalKey, setInternalKey] = useState(defaultKey);
    const currentKey = activeKey ?? internalKey;
    const activeIndex = Math.max(
        0,
        TABS.findIndex((t) => t.key === currentKey),
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
        trackWidth > 0 ? (trackWidth - ITEM_W) / (TABS.length - 1) : 0;
    const indicatorX = indicatorIndex.interpolate({
        inputRange: TABS.map((_, i) => i),
        outputRange: TABS.map((_, i) => i * step),
    });

    return (
        <View
            style={[
                styles.outer,
                { paddingBottom: insets.bottom + spacing.sm },
            ]}
        >
            <View style={styles.pill}>
                <View
                    style={styles.track}
                    onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
                    accessibilityRole="tablist"
                >
                    {trackWidth > 0 && (
                        <Animated.View
                            pointerEvents="none"
                            style={[
                                styles.indicator,
                                { transform: [{ translateX: indicatorX }] },
                            ]}
                        />
                    )}
                    {TABS.map((tab) => (
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

const styles = StyleSheet.create({
    outer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    pill: {
        backgroundColor: colors.surface,
        borderWidth: BORDER,
        borderColor: colors.border,
        borderRadius: RADIUS,
        padding: spacing.sm,
    },
    track: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: ITEM_H,
    },
    indicator: {
        position: "absolute",
        top: 0,
        left: 0,
        width: ITEM_W,
        height: ITEM_H,
        borderRadius: RADIUS,
        backgroundColor: colors.primary,
    },
    item: {
        width: ITEM_W,
        height: ITEM_H,
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrap: {
        width: 24,
        height: 24,
    },
    label: {
        fontFamily: FONT_BOLD,
        fontSize: fontSizes.sm,
        lineHeight: 12,
        textAlign: "center",
    },
});