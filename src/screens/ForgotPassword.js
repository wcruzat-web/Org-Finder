import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText, AppInput, AppButton, AppModal } from "../components/ui";
import { layout } from "../styles/style";

import { resetPassword } from "../../library/services/authService.js";

export default function ForgotPassword({ onNavigate, onBack }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
    onConfirm: null,
  });

  const showModal = (title, message, options = {}) => {
    setModal({
      visible: true,
      title,
      message,
      type: options.type || "alert",
      confirmText: options.confirmText || "OK",
      onConfirm: options.onConfirm || null,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      showModal("Required", "Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);

      // password reset functionality will be integrated next.
      await resetPassword(email.trim().toLowerCase());

      showModal(
        "Success",
        "A password reset link has been sent to your email address.",
        {
          onConfirm: onBack,
        },
      );
    } catch (error) {
      showModal("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        onConfirm={() => {
          const callback = modal.onConfirm;
          closeModal();
          callback?.();
        }}
        onClose={closeModal}
      />
    </>
  );
}