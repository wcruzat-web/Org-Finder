import React, { useState } from "react";
import {
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import MainTabs from "./src/navigations/MainTabs";

export default function App() {
    const [currentScreen, setCurrentScreen] = useState("login");

    if (currentScreen === "main") {
        return (
            <SafeAreaProvider>
                <StatusBar backgroundColor="#2D3047" barStyle="light-content" />
                <NavigationContainer>
                    <MainTabs onLogout={() => setCurrentScreen("login")} />
                </NavigationContainer>
            </SafeAreaProvider>
        );
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#2D3047" }}>
                <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    {currentScreen === "login" ? (
                        <Login
                            onNavigate={() => setCurrentScreen("signin")}
                            onLogin={() => setCurrentScreen("main")}
                        />
                    ) : (
                        <Signup onNavigate={() => setCurrentScreen("login")} />
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
