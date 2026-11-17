import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import Header from "../components/Header";
import theme, { spacing } from "../styles/theme-dark";
import StarsSvg from "../../assets/header/stars.svg";
import MountainsFrontSvg from "../../assets/header/mountains-front.svg";

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

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const navHeaderHeight = useHeaderHeight();
    const headerHeight = width * (219.071 / 390) + insets.top;

    return (
        <ParallaxHeaderScrollView
            layers={HEADER_LAYERS}
            headerHeight={headerHeight}
            bodyColor={colors.background}
            bottomPadding={spacing.md}
            headerContent={
                <>
                    <View
                        style={[
                            styles.welcome,
                            { paddingTop: navHeaderHeight + 12 },
                        ]}
                    >
                        <Text style={styles.greeting}>Greetings, User.</Text>
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
                        <Text style={styles.cardText}>
                            Organization {i + 1}
                        </Text>
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
