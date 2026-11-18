import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { loginUser } from "../../library/services/authService.js";

const COLORS = {
  background: "#2D3047",
  gold: "#DDB68E",
  white: "#F5F1F0",
  gray: "#A7A8B5",
};

export default function Login({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Required", "Please enter your email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email.trim().toLowerCase(), password);
      Alert.alert("Success", "Login successful.", [
        {
          text: "Continue",
          onPress: onLoginSuccess,
        },
      ]);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Find the right organization for your needs.
      </Text>

      <View style={styles.inputs}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={COLORS.gray}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.background} />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Don't have an account? </Text>

        <TouchableOpacity onPress={onNavigate}>
          <Text style={styles.switchLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  inputs: {
    gap: 14,
  },
  input: {
    height: 52,
    backgroundColor: "#373A51",
    borderRadius: 12,
    paddingHorizontal: 17,
    color: COLORS.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#454960",
  },
  forgot: {
    alignItems: "flex-end",
    marginTop: 13,
  },
  forgotText: {
    color: COLORS.gold,
    fontSize: 12,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.gold,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 23,
  },
  switchText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  switchLink: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "600",
  },
});