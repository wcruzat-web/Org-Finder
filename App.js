import React, { useState, useEffect } from "react";
import { StatusBar, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

import { useFonts } from "expo-font";
import { Overlock_700Bold } from "@expo-google-fonts/overlock";
import {
  Cause_900Black,
  Cause_700Bold,
  Cause_400Regular,
  Cause_200ExtraLight,
} from "@expo-google-fonts/cause";
import {
  Fredoka_900Black,
  Fredoka_700Bold,
  Fredoka_400Regular,
  Fredoka_300Light,
} from "@expo-google-fonts/fredoka";

import AuthNavigator from "./src/navigations/AuthNavigator.js";
import MainTabs from "./src/navigations/MainTabs";

import supabase from "./library/supabase.js";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, err] = useFonts({
    Overlock_700Bold,
    Cause_200ExtraLight, Cause_400Regular, Cause_700Bold, Cause_900Black,
    Fredoka_300Light, Fredoka_400Regular, Fredoka_700Bold, Fredoka_900Black,
  });

  const [currentScreen, setCurrentScreen] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (fontsLoaded || err) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, err]);

  useEffect(() => {
    let isMounted = true;
    let authStateChanged = false;

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted || authStateChanged) return;

      if (error) {
        Alert.alert("Session Error", error.message);
        setCurrentScreen("auth");
        return;
      }

      setCurrentScreen(data.session ? "home" : "auth");
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!isMounted) return;

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        authStateChanged = true;
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

  if (!fontsLoaded && !err) {
    return null;
  }

  const handleRegistrationComplete = () => {
    setIsRegistering(false);
    setCurrentScreen("home");
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#2D3047" }}>
          <StatusBar backgroundColor="#2D3047" barStyle="light-content" />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {currentScreen === "home" && !isRegistering ? (
              <MainTabs />
            ) : (
              <AuthNavigator
                onRegistering={setIsRegistering}
                onRegistrationComplete={handleRegistrationComplete}
              />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
