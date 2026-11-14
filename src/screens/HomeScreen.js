import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";
import theme from "../styles/theme-dark";
import Stars from "../../assets/header/stars.svg";
import MountainsFront from "../../assets/header/mountains-front.svg";
import ParallaxHeaderScrollView from "../components/ParallaxHeaderScrollView";
import Header from "../components/Header";

const { colors } = theme;

const HEADER_LAYERS = [
    {
        source: require("../../assets/header/sky.png"),
        anchor: "top",
        speed: 0.25,
        fill: true,
    },
    {
        source: <Stars width="100%" height="100%" />,
        aspectRatio: 390 / 157,
        anchor: "top",
        speed: 0.1,
        stretch: false,
        fade: [0, 0.6],
    },
    {
        source: require("../../assets/header/mountains-back.png"),
        anchor: "bottom",
        speed: 0.7,
    },
    {
        source: <MountainsFront width="100%" height="100%" />,
        aspectRatio: 390 / 43,
        anchor: "bottom",
        speed: 1,
    },
];

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const headerHeight = width * (219.071 / 390);

    return (
        <SafeAreaProvider>
            <ParallaxHeaderScrollView
            layers={HEADER_LAYERS}
            headerHeight={headerHeight}
            bodyColor={colors.background}
            bottomPadding={120} // room for the floating tab bar
            headerContent={
                <View
                    style={{
                        paddingTop: insets.top + 16,
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={styles.greeting}>Greetings, User.</Text>
                    <Text style={styles.subtitle}>
                        What would you like to do today?
                    </Text>
                </View>
            }
        >
        </ParallaxHeaderScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: "600" },
    greeting: {
        color: colors.textPrimary,
        fontSize: 30,
        fontWeight: "700",
        marginTop: 24,
    },
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