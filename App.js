import React, { useState, useEffect } from "react";
import { StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./src/screens/Login";
import Signin from "./src/screens/Signin";
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
        setCurrentScreen("login");
        return;
      }

      setCurrentScreen(data.session ? "home" : "login");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setCurrentScreen("home");
      }

      if (event === "SIGNED_OUT") {
        setCurrentScreen("login");
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
              <MainTabs onLogout={() => setCurrentScreen("login")} />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
