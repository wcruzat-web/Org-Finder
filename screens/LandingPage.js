import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

import { logoutUser } from "../library/services/authService.js";

export default function LandingTest() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logoutUser();

      Alert.alert("Logged Out", "You have successfully logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✦ OrgFinder</Text>

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>You're now logged in.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging Out..." : "Logout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3047",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  logo: {
    color: "#DDB68E",
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 35,
  },
  title: {
    color: "#F5F1F0",
    fontSize: 27,
    fontWeight: "600",
  },
  subtitle: {
    color: "#A7A8B5",
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#DDB68E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#2D3047",
    fontSize: 15,
    fontWeight: "600",
  },
});
