import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  registerUser,
  verification,
  createStudentAccount,
} from "../../library/services/authService.js";

export default function Signin({
  onNavigate,
  onRegistering,
  onRegistrationComplete,
}) {
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
      <Text style={styles.title}>
        {otpSent
          ? "Verify Your Email"
          : nameStep
            ? "What's Your Full Name?"
            : courseStep
              ? "What's Your Course?"
              : "Create Account"}
      </Text>

      <Text style={styles.subtitle}>
        {otpSent
          ? "Enter the verification code sent to your email."
          : nameStep
            ? "Please enter your full name."
            : courseStep
              ? "Please enter your course."
              : "Create your OrgFinder account."}
      </Text>

      {!otpSent && !nameStep && !courseStep ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#A7A8B5"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A7A8B5"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#A7A8B5"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#2D3047" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : otpSent ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#A7A8B5"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#2D3047" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : nameStep ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A7A8B5"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
          />

          <TouchableOpacity style={styles.button} onPress={handleNameSubmit}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : courseStep ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Course"
            placeholderTextColor="#A7A8B5"
            autoCapitalize="characters"
            value={course}
            onChangeText={setCourse}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCourseSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#2D3047" />
            ) : (
              <Text style={styles.buttonText}>Finish Registration</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {!otpSent && !nameStep && !courseStep && (
        <TouchableOpacity onPress={onNavigate}>
          <Text style={styles.switchText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#F5F1F0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#A7A8B5",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  form: {
    gap: 14,
  },
  input: {
    height: 52,
    backgroundColor: "#373A51",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#F5F1F0",
    borderWidth: 1,
    borderColor: "#454960",
  },
  button: {
    height: 50,
    backgroundColor: "#DDB68E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#2D3047",
    fontWeight: "600",
  },
  switchText: {
    color: "#DDB68E",
    textAlign: "center",
    marginTop: 24,
  },
});
