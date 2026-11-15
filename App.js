import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";

import Login from "./screens/Login";
import Signin from "./screens/Signin";
import LandingTest from "./screens/LandingPage";

import supabase from "./library/supabase.js";
import "./library/services/googleAuthServices.js";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("login");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);

      if (event === "SIGNED_OUT") {
        setCurrentScreen("login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#2D3047",
        }}
      >
        <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#DDB68E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D3047",
      }}
    >
      <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {session ? (
          <LandingTest />
        ) : currentScreen === "login" ? (
          <Login onNavigate={() => setCurrentScreen("signin")} />
        ) : (
          <Signin onNavigate={() => setCurrentScreen("login")} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
