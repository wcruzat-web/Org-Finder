import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Search, FileText, Users, Bell, User } from "lucide-react-native";

// Design tokens (from Figma: brand/primary, neutral/500, neutral/200, white)
const COLORS = {
    active: "#1e3a8a",
    inactive: "#6b7280",
    border: "#e5e7eb",
    bg: "#ffffff",
};

const TABS = [
    { key: "discover", label: "Discover", Icon: Search },
    { key: "applications", label: "Applications", Icon: FileText },
    { key: "orgs", label: "My Orgs", Icon: Users },
    { key: "alerts", label: "Alerts", Icon: Bell },
    { key: "profile", label: "Profile", Icon: User },
];

const ITEM_W = 70;
const ITEM_H = 52;
const PAD_X = 10;
const INDICATOR_W = 24;

function NavItem({ tab, active, onPress }) {
    const { Icon, label } = tab;

    // pop: native-driven (icon crossfade, scale, lift)
    const pop = useRef(new Animated.Value(active ? 1 : 0)).current;
    // tint: JS-driven (label color)
    const tint = useRef(new Animated.Value(active ? 1 : 0)).current;
    // press: native-driven (tap feedback)
    const press = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(pop, {
            toValue: active ? 1 : 0,
            friction: 5,
            tension: 140,
            useNativeDriver: true,
        }).start();
        Animated.timing(tint, {
            toValue: active ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [active, pop, tint]);

    const handlePressIn = () =>
        Animated.spring(press, {
            toValue: 0.9,
            useNativeDriver: true,
            speed: 50,
        }).start();
    const handlePressOut = () =>
        Animated.spring(press, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();

    const activeOpacity = pop.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });
    const inactiveOpacity = pop.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });
    const iconScale = pop.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
    });
    const iconLift = pop.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -2],
    });
    const labelColor = tint.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.inactive, COLORS.active],
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
                <Animated.View
                    style={[
                        styles.iconWrap,
                        {
                            transform: [
                                { translateY: iconLift },
                                { scale: iconScale },
                            ],
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: inactiveOpacity },
                        ]}
                    >
                        <Icon
                            size={24}
                            color={COLORS.inactive}
                            strokeWidth={1.75}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            { opacity: activeOpacity },
                        ]}
                    >
                        <Icon size={24} color={COLORS.active} strokeWidth={2} />
                    </Animated.View>
                </Animated.View>
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
    // works controlled (activeKey + onChange) or uncontrolled
    const [internalKey, setInternalKey] = useState(defaultKey);
    const currentKey = activeKey ?? internalKey;
    const activeIndex = Math.max(
        0,
        TABS.findIndex((t) => t.key === currentKey),
    );

    const [width, setWidth] = useState(0);
    const indicatorIndex = useRef(new Animated.Value(activeIndex)).current;

    useEffect(() => {
        Animated.spring(indicatorIndex, {
            toValue: activeIndex,
            friction: 7,
            tension: 120,
            useNativeDriver: true,
        }).start();
    }, [activeIndex, indicatorIndex]);

    const handlePress = (key) => {
        if (activeKey === undefined) setInternalKey(key);
        onChange?.(key);
    };

    // space-between layout: distance between item left edges
    const step =
        width > 0 ? (width - PAD_X * 2 - ITEM_W) / (TABS.length - 1) : 0;
    const indicatorX = indicatorIndex.interpolate({
        inputRange: TABS.map((_, i) => i),
        outputRange: TABS.map(
            (_, i) => PAD_X + i * step + (ITEM_W - INDICATOR_W) / 2,
        ),
    });

    return (
        <View
            style={styles.container}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            accessibilityRole="tablist"
        >
            {width > 0 && (
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
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: COLORS.bg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 6,
        paddingBottom: 26, // matches Figma (room for the home indicator)
        paddingHorizontal: PAD_X,
    },
    item: {
        width: ITEM_W,
        height: ITEM_H,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    iconWrap: {
        width: 24,
        height: 24,
    },
    label: {
        fontFamily: "Inter-Medium", // load Inter Medium, or remove to use system font
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 16,
    },
    indicator: {
        position: "absolute",
        top: -1, // sits on the top border
        left: 0,
        width: INDICATOR_W,
        height: 3,
        borderRadius: 2,
        backgroundColor: COLORS.active,
    },
});