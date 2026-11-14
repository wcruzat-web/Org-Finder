import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";

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

export default function Login({ onNavigate }) {
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
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.gray}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Don't have an account? </Text>

          <TouchableOpacity onPress={onNavigate}>
            <Text style={styles.switchLink}>Sign Up</Text>
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
