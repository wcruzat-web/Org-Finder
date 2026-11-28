
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppInput, AppButton } from "../components/ui";
import AppModal from "../components/ui/AppModal";
import { layout } from "../styles/style";

import { loginUser } from "../../library/services/authService.js";

export default function Login({
  onNavigate,
  onLoginSuccess,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    type: "alert",
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const showModal = (options) => {
    setModal({
      visible: true,
      type: "alert",
      title: "",
      message: "",
      confirmText: "",
      onConfirm: null,
      ...options,
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      showModal({
        title: "Required",
        message: "Please enter your email and password.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email.trim().toLowerCase(), password);

      showModal({
        type: "confirm",
        title: "Success",
        message: "Login successful.",
        confirmText: "Continue",
        onConfirm: onLoginSuccess,
      });
    } catch (error) {
      showModal({
        title: "Login Failed",
        message: error.message,
      });
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

      <TouchableOpacity onPress={onForgotPassword} style={layout.formAside}>
        <AppText variant="link">Forgot Password?</AppText>
      </TouchableOpacity>

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

      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </View>
  );
}
