// src/navigation/MainTabs.js
//
// The page loader shown after login. The top bar and nav bar are defined here once;
// pages never render them. Only Discover is connected for now.

import React from "react";
import { Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen.js";
import theme from "../styles/theme-dark";

import logoutUser from "../../library/services/authService.js";

const { colors } = theme;
const Tab = createBottomTabNavigator();

// BottomNav works with keys ("discover", "orgs", ...), not React Navigation props.
// This adapter connects them: a route named "Discover" matches the key "discover".
function renderNavBar({ state, navigation }) {
  return (
    <BottomNav
      activeKey={state.routes[state.index].name.toLowerCase()}
      onChange={(key) => {
        const route = state.routes.find((r) => r.name.toLowerCase() === key);
        // Tabs without a page yet have no route, so tapping them does nothing
        if (route) navigation.navigate(route.name);
      }}
    />
  );
}

export default function MainTabs({ onLogout }) {
  // TEMPORARY: until the menu is designed, the menu icon offers a log out
  // so you can get back to the login screen while testing.
  const confirmLogout = async () => {
    Alert.alert("Menu", "Log out of OrgFinder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: await logoutUser().then(onLogout),
      },
    ]);
  };

  return (
    <Tab.Navigator
      initialRouteName="Discover"
      tabBar={renderNavBar}
      screenOptions={{
        // The header floats over the page so content can scroll under its fade
        headerTransparent: true,
        header: ({ options }) => (
          <Header title={options.title} />
        ),
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{ title: "Discover" }}
      />
      <Tab.Screen
        name="Profile"
        options={{ title: "Profile" }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      {/* Later, named to match BottomNav's keys: Applications, Orgs, Alerts, Profile */}
    </Tab.Navigator>
  );
}
