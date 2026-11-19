
import React, { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import Login from "../screens/Login";
import Signin from "../screens/Signin";

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
