import React, { useState } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { AppText, AppInput, AppButton } from "../components/ui";
import { layout } from "../styles/style";

import { loginUser } from "../../library/services/authService.js";

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
      <View style={layout.formHeader}>
        <AppText variant="title">Welcome Back</AppText>
        <AppText variant="subtitle" align="center">
          Find the right organization for your needs.
        </AppText>
      </View>

      <View style={layout.stack}>
        <AppInput
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <AppInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <AppText variant="link" style={layout.formAside}>
        Forgot Password?
      </AppText>

      <AppButton
        title="Log In"
        loading={isLoading}
        onPress={handleLogin}
        style={layout.formAction}
      />

      <TouchableOpacity style={layout.formFooter} onPress={onNavigate}>
        <AppText variant="caption">Don't have an account? </AppText>
        <AppText variant="link">Sign In</AppText>
      </TouchableOpacity>
    </View>
  );
}
