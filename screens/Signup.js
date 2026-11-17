import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  registerUser,
  verification as verifyEmailOtp,
  setAccountPassword,
} from "../library/services/authService.js";

const EMPTY_ERRORS = {
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
};

const PASSWORD_RULES = [
  /[A-Z]/,
  /[a-z]/,
  /[0-9]/,
  /[!@#$%^&*(),.?":{}|<>]/,
];

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const normalizedEmail = email.trim().toLowerCase();

  const validateForm = () => {
    const newErrors = { ...EMPTY_ERRORS };

    if (!normalizedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@cvsu\.edu\.ph$/.test(normalizedEmail)) {
      newErrors.email = "Please use your CVSU institutional email.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!PASSWORD_RULES.every((regex) => regex.test(password))) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const sendOtp = async () => {
    try {
      setLoading(true);
      await registerUser(normalizedEmail);
      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your CVSU email.");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    await sendOtp();
  };

  const handleVerifyOtp = async () => {
    const newErrors = { ...EMPTY_ERRORS };

    if (!otp.trim()) {
      newErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(otp.trim())) {
      newErrors.otp = "Please enter a valid 6-digit OTP.";
    }

    setErrors(newErrors);
    if (newErrors.otp) return;

    try {
      setLoading(true);

      // 1. Verify the code (this also signs the user in)
      await verifyEmailOtp(normalizedEmail, otp.trim());

      // 2. Save the password they chose on the form
      await setAccountPassword(password);

      Alert.alert("Success", "Your account has been created.");
      // TODO: navigate to your home screen here
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp("");
    setErrors(EMPTY_ERRORS);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="CVSU Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!otpSent}
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      {!otpSent && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending OTP..." : "Register"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {otpSent && (
        <>
          <Text style={styles.description}>
            Enter the 6-digit verification code sent to your email.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="6-digit OTP"
            value={otp}
            onChangeText={(value) => {
              setOtp(value.replace(/\D/g, ""));
              setErrors((prev) => ({ ...prev, otp: "" }));
            }}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.otp ? (
            <Text style={styles.errorText}>{errors.otp}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={sendOtp} disabled={loading}>
            <Text style={styles.linkText}>Resend code</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangeEmail} disabled={loading}>
            <Text style={styles.linkText}>Change email</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#176B3A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: "#555",
  },
  linkText: {
    color: "#176B3A",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
});