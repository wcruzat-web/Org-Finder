import { registerUser } from "./authService.js";

try {
  const result = await registerUser("wency.cruzat@cvsu.edu.ph");

  console.log("Registration successful:", result);
} catch (error) {
  console.error("Registration failed:", error.message);
}
