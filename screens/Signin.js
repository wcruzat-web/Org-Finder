import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

//? import this jade para sa google auth
import { signInWithGoogle } from "../library/services/googleAuthServices.js";

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

export default function Signin({ onNavigate }) {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const result = await signInWithGoogle();

      if (result.cancelled) return;

      const user = result.user;

      console.log("bai na successful auth mo:", user);

      Alert.alert("Google Sign-In Successful", `Welcome, ${user.email}!`);
    } catch (error) {
      console.log("bai may mali sa auth natin:", error);

      Alert.alert(
        "Google Sign-In Error",
        "An error occurred during Google Sign-In. Please try again.",
      );
    } finally {
      setLoading(false);
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

        <TouchableOpacity
          style={styles.googleButton}
          activeOpacity={0.8}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>
            {loading ? "Connecting..." : "Continue with Google"}
          </Text>
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
  googleButton: {
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  googleIcon: {
    color: "#4285F4",
    fontSize: 19,
    fontWeight: "700",
  },
  googleButtonText: {
    color: "#2D3047",
    fontSize: 14,
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
