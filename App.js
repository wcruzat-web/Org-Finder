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

import Login from "./src/screens/Login";
import Signin from "./src/screens/Signin";
import MainTabs from "./src/navigations/MainTabs";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

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
              onLoginSuccess={() => setCurrentScreen("home")}
            />
          ) : currentScreen === "signin" ? (
            <Signin
              onNavigate={() => setCurrentScreen("login")}
              onRegistrationComplete={() => setCurrentScreen("home")}
            />
          ) : (
            <MainTabs />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
