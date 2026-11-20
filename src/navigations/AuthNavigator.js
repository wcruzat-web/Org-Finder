
import React, { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import Login from "../screens/Login";
import Signin from "../screens/Signin";

// Switches between the login and signup pages. The stars and wordmark live in
// AuthLayout, so they stay mounted (and keep animating) while the page changes.
export default function AuthNavigator({ onRegistering, onRegistrationComplete }) {
  const [screen, setScreen] = useState("login");

  return (
    <AuthLayout>
      {screen === "login" ? (
        <Login
          onNavigate={() => setScreen("signin")}
        />
      ) : (
        <Signin
          onNavigate={() => setScreen("login")}
          onRegistering={onRegistering}
          onRegistrationComplete={onRegistrationComplete}
        />
      )}
    </AuthLayout>
  );
}
