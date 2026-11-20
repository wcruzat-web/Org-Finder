import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { AppText, AppInput, AppButton } from "../components/ui";

import { layout } from "../styles/style";

import {
  registerUser,
  verification,
  createStudentAccount,
} from "../../library/services/authService.js";

export default function Signin({ onNavigate, onRegistering, onRegistrationComplete }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [course, setCourse] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [nameStep, setNameStep] = useState(false);
  const [courseStep, setCourseStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    } else if (false) {
      // This is a placeholder for the condition that checks if the password is valid
    } else {
      for (const [key, regex] of Object.entries(passwordRegex)) {
        if (!regex.test(password)) {
          Alert.alert(
            "Error",
            `Password must contain at least one ${key} character.`,
          );
          return;
        }
      }
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      onRegistering(true);
      await registerUser(email.trim().toLowerCase(), password);
      setOtpSent(true);
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      await verification(email.trim().toLowerCase(), otp);
      setOtpSent(false);
      setNameStep(true);
    } catch (error) { 
      Alert.alert("Verification Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = () => {
    if (!fullName.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }

    setNameStep(false);
    setCourseStep(true);
  };

  const handleCourseSubmit = async () => {
    if (!course.trim()) {
      Alert.alert("Required", "Please enter your course.");
      return;
    }

    try {
      setIsLoading(true);
      await createStudentAccount(fullName, course);
      Alert.alert("Success", "Account created successfully.", [
        {
          text: "Continue",
          onPress: onRegistrationComplete,
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Account Creation Failed",
        "Account Already Exists or " + error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View style={layout.formHeader}>
        <AppText variant="title">
          {otpSent
            ? "Verify Your Email"
            : nameStep
              ? "What's Your Full Name?"
              : courseStep
                ? "What's Your Course?"
                : "Create Account"}
        </AppText>
        <AppText variant="subtitle" align="center">
          {otpSent
            ? "Enter the verification code sent to your email."
            : nameStep
              ? "Please enter your full name."
              : courseStep
                ? "Please enter your course."
                : "Create your OrgFinder account."}
        </AppText>
      </View>

      {!otpSent && !nameStep && !courseStep ? (
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

          <AppInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <AppButton
                  title="Create Account"
                  loading={isLoading}
                  onPress={handleRegister}
                  style={layout.formAction}
                />
        </View>
      ) : otpSent ? (
        <View style={layout.stack}>
          <AppInput
            placeholder="Enter OTP"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <AppButton
                  title="Verify OTP"
                  loading={isLoading}
                  onPress={handleVerifyOtp}
                  style={layout.formAction}
                />
        </View>
      ) : nameStep ? (
        <View style={layout.stack}>
          <AppInput
            placeholder="Full Name"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />

          <AppButton
                  title="Continue"
                  loading={isLoading}
                  onPress={handleNameSubmit}
                  style={layout.formAction}
                />
        </View>
      ) : courseStep ? (
        <View style={layout.stack}>
          <AppInput
            placeholder="Course"
            autoCapitalize="characters"
            value={course}
            onChangeText={setCourse}
          />

          <AppButton
                  title="Finish Registration"
                  loading={isLoading}
                  onPress={handleCourseSubmit}
                  style={layout.formAction}
                />
        </View>
      ) : null}

      {!otpSent && !nameStep && !courseStep && (
        <TouchableOpacity style={layout.formFooter} onPress={onNavigate}>
          <AppText variant="caption">Already have an account? </AppText>
                  <AppText variant="link">Log In</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}