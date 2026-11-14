import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

//!wag na ites baguhin, eto na yung connection for our database
import { registerAccount } from "../library/services/authService.js";

const COLORS = {
  background: "#2D3047",
  gold: "#DDB68E",
  white: "#F5F1F0",
  gray: "#A7A8B5",
};

const stars = Array.from({ length: 35 }, (_, i) => ({
  top: (i * 37) % 270,
  left: `${(i * 17) % 100}%`,
  size: 8 + (i % 7),
}));

export default function Signup({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setError] = useState({});

  //! eto muna yung logic na gamitin kase wala pa usch backend integration
  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@cvsu\.edu\.ph$/i;
    const passwordRegex = {
      uppercase: {
        regex: /[A-Z]/,
        message: "Password must contain at least one uppercase letter",
      },
      lowercase: {
        regex: /[a-z]/,
        message: "Password must contain at least one lowercase letter",
      },
      digit: {
        regex: /[0-9]/,
        message: "Password must contain at least one digit",
      },
      special: {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        message: "Password must contain at least one special character",
      },
    };

    const errorsExist = {};

    if (!email.trim()) {
      errorsExist.email = "Email address is required";
    } else if (!emailRegex.test(email)) {
      errorsExist.email = "Please enter a valid CVSU email address";
    }

    //? wala na ko maisip na validation ng sa project AHSSAHSHADAHDS
    if (!password.trim()) {
      errorsExist.password = "Password is required";
    } else if (password.length < 8) {
      errorsExist.password = "Password must be at least 8 characters long";
    } else {
      for (const { regex, message } of Object.values(passwordRegex)) {
        if (!regex.test(password)) {
          errorsExist.password = message;
          break;
        }
      }
    }

    if (!confirmPassword.trim()) {
      errorsExist.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errorsExist.confirmPassword = "Passwords do not match";
    }

    setError(errorsExist);

    if (Object.keys(errorsExist).length > 0) {
      return;
    }

    try {
      const data = await registerAccount(email, password);
      console.log("User registered successfully:", data);

      Alert.alert(
        "Form validated successfully",
        `${data.user.email} has been registered successfully!`,
      );
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.hero}>
        {stars.map((star, index) => (
          <Text
            key={index}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                fontSize: star.size,
              },
            ]}
          >
            ✦
          </Text>
        ))}

        <Text style={styles.logo}>✦ StarGaze</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Find the right organization for your needs.
        </Text>

        {/** Email Input, testing ulit 1*/}
        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={COLORS.gray}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          {/* Password Input, testing ulit 2 */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
          {/* Confirm Password Input, testing ulit 3*/}
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Already have an account? </Text>

          <TouchableOpacity onPress={onNavigate}>
            <Text style={styles.switchLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
  },
  hero: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  star: {
    position: "absolute",
    color: "#747B92",
    opacity: 0.65,
  },
  logo: {
    color: COLORS.gold,
    fontSize: 23,
    fontWeight: "600",
  },
  form: {
    paddingHorizontal: 28,
    paddingBottom: 50,
  },
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
  error: {
    color: "#FF8585",
    fontSize: 12,
    marginTop: -8,
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
