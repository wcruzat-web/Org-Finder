import React, { useState, useEffect } from "react";
import { StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./src/navigations/AuthNavigator.js";
import MainTabs from "./src/navigations/MainTabs";

import supabase from "./library/supabase.js";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        Alert.alert("Session Error", error.message);
        setCurrentScreen("auth");
        return;
      }

      setCurrentScreen(data.session ? "home" : "auth");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setCurrentScreen("home");
      }

      if (event === "SIGNED_OUT") {
        setCurrentScreen("auth");
      }
    });

    initializeSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2D3047" }}>
          <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
          {currentScreen === "auth" ? (
              <AuthNavigator onAuthenticated={() => setCurrentScreen("home")} />
            ) : currentScreen === "home" ? (
              <MainTabs onLogout={() => setCurrentScreen("auth")} />
            ) : null}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
