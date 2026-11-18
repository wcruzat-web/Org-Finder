import React, { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import Login from "../screens/Login";
import Signin from "../screens/Signin";

// Switches between the login and signup pages. The stars and wordmark live in
// AuthLayout, so they stay mounted (and keep animating) while the page changes.
export default function AuthNavigator({ onAuthenticated }) {
  const [screen, setScreen] = useState("login");

  return (
    <AuthLayout>
      {screen === "login" ? (
        <Login
          onNavigate={() => setScreen("signin")}
          onLoginSuccess={onAuthenticated}
        />
      ) : (
        <Signin
          onNavigate={() => setScreen("login")}
          onRegistrationComplete={onAuthenticated}
        />
      )}
    </AuthLayout>
  );
}