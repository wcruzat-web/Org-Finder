import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../styles/theme-dark";
import BackIcon from "../../assets/icons/Back";
import MenuIcon from "../../assets/icons/Menu";

const { colors, spacing, fontSizes } = theme;

const FONT_BOLD = "Overlock_700Bold";

const VARIANTS = {
    default: { showBack: false, centered: false, fontSize: fontSizes["2xl"] },
    withReturnButton: {
        showBack: true,
        centered: true,
        fontSize: fontSizes.xl,
    },
};

function IconButton({ label, onPress, children }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            hitSlop={8}
            style={styles.iconButton}
        >
            {children}
        </Pressable>
    );
}

export default function Header({
    title,
    variant = "default",
    onBack,
    onMenuPress,
    fadeHeight = spacing["2xl"], // space under the row used by the fade; 0 = no fade space
    safeArea = true, // add the status bar / notch height on top
    }) {
    const insets = useSafeAreaInsets();
    const v = VARIANTS[variant] ?? VARIANTS.default;

    return (
        <LinearGradient
            // Solid for the top quarter, then fades out. Same color at 0 alpha avoids a gray fringe.
            colors={[colors.background, `${colors.background}00`]}
            locations={[0.25, 1]}
            // The fade area is only decoration: let touches pass through to what's underneath
            pointerEvents="box-none"
            style={[
                styles.container,
                {
                    paddingTop: spacing.lg + (safeArea ? insets.top : 0),
                    paddingBottom: fadeHeight,
                },
            ]}
        >
            {v.showBack ? (
                <IconButton label="Go back" onPress={onBack}>
                    <BackIcon />
                </IconButton>
            ) : null}

            <Text
                numberOfLines={1}
                style={[
                    styles.title,
                    { fontSize: v.fontSize },
                    v.centered && styles.centered,
                ]}
            >
                {title}
            </Text>

            <IconButton label="Menu" onPress={onMenuPress}>
                <MenuIcon />
            </IconButton>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
    },
    title: {
        flex: 1,
        color: colors.textPrimary,
        fontFamily: FONT_BOLD,
    },
    centered: { textAlign: "center" },
    iconButton: { width: 24, height: 24 },
});