import { registerAccount } from "./authService.js";

const tryRegistration = async () => {
  try {
    const data = await registerAccount("error@cvsu.edu.ph", "Trial@123");

    console.log("User registered successfully:", data);
  } catch (error) {
    console.error("Error during registration:", error.message);
  }
};

tryRegistration();
