import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
);

const { data, error } = await supabase.auth.signInWithOtp({
  email: "wency.dev@gmail.com",
});

if (error) {
  console.error("OTP Error:", error.message);
} else {
  console.log("OTP request successful!");
}
