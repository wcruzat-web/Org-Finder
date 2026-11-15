
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import supabase from "../supabase.js";

export default function SessionTest() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      setSession(data.session);
    } catch (err) {
      console.error("Session check failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Session Test</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#DDB68E" />
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : session ? (
        <>
          <Text style={styles.success}>SESSION FOUND</Text>
          <Text style={styles.label}>Authenticated Email:</Text>
          <Text style={styles.value}>{session.user.email}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{session.user.id}</Text>
        </>
      ) : (
        <Text style={styles.error}>NO ACTIVE SESSION FOUND</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={checkSession}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Check Session Again</Text>
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
    padding: 25,
  },
  title: {
    color: "#F5F1F0",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
  },
  success: {
    color: "#70D89A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  error: {
    color: "#FF8585",
    fontSize: 15,
    marginBottom: 20,
  },
  label: {
    color: "#A7A8B5",
    fontSize: 13,
    marginTop: 15,
  },
  value: {
    color: "#F5F1F0",
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#DDB68E",
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 35,
  },
  buttonText: {
    color: "#2D3047",
    fontWeight: "600",
  },
});
