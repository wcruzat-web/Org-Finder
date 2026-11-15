import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Login from "./screens/Login";
import Signin from "./screens/Signin";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2D3047" }}>
      <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {currentScreen === "login" ? (
          <Login onNavigate={() => setCurrentScreen("signin")} />
        ) : (
          <Signin onNavigate={() => setCurrentScreen("login")} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
