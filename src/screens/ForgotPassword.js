import React, { useState } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { AppText, AppInput, AppButton } from "../components/ui";
import { layout } from "../styles/style";

import { resetPassword } from "../../library/services/authService.js";
export default function ForgotPassword({ onNavigate, onBack }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);

      // password reset functionality will be integrated next.
      await resetPassword(email.trim().toLowerCase());

      Alert.alert(
        "Success",
        "A password reset link has been sent to your email address.",
        [
          {
            text: "OK",
            onPress: onBack,
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View style={layout.formHeader}>
        <AppText variant="title">Forgot Password?</AppText>
        <AppText variant="subtitle" align="center">
          Enter your registered email address to reset your password.
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
      </View>

      <AppButton
        title="Send Reset Link"
        loading={isLoading}
        onPress={handleSubmit}
        style={layout.formAction}
      />

      <TouchableOpacity style={layout.formFooter} onPress={onBack}>
        <AppText variant="caption">Remember your password? </AppText>
        <AppText variant="link">Log In</AppText>
      </TouchableOpacity>
    </View>
  );
}
