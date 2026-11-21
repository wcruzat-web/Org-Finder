import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "dotenv/config.js"; // Load environment variables from .env file

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const form = document.getElementById("reset-form");
const passwordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const submitButton = document.getElementById("submit-button");
const statusMessage = document.getElementById("status-message");

const showMessage = (message, type) => {
  statusMessage.textContent = message;
  statusMessage.className = `status visible ${type}`;
};

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Hide" : "Show";
  });
});

const initializeRecoverySession = async () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(window.location.hash.slice(1));
  const linkError =
    url.searchParams.get("error_description") ||
    params.get("error_description");

  if (linkError) {
    showMessage(linkError, "error");
    submitButton.disabled = true;
    return false;
  }

  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      showMessage(error.message, "error");
      submitButton.disabled = true;
      return false;
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    showMessage(
      "This recovery link is invalid or expired. Request a new password reset email from OrgFinder.",
      "error",
    );
    submitButton.disabled = true;
    return false;
  }
  return true;
};

let recoveryReady = false;
try {
  recoveryReady = await initializeRecoverySession();
} catch (error) {
  showMessage(error.message || "Unable to verify this recovery link.", "error");
  submitButton.disabled = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!recoveryReady) {
    showMessage(
      "Your recovery link could not be verified. Request a new one from OrgFinder.",
      "error",
    );
    return;
  }

  const password = passwordInput.value;
  if (password.length < 6) {
    showMessage("Your password must contain at least 6 characters.", "error");
    return;
  }
  if (password !== confirmPasswordInput.value) {
    showMessage("The passwords do not match.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Updating...";
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    showMessage(error.message, "error");
    submitButton.disabled = false;
    submitButton.textContent = "Update password";
    return;
  }

  form.reset();
  showMessage(
    "Your password has been updated. You can now sign in to OrgFinder with your new password.",
    "success",
  );
  submitButton.textContent = "Password updated";
});
