import supabase from "../supabase.js";

//* validation ng email
const validateEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@cvsu\.edu\.ph$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new Error(
      "Invalid email format. Please use a valid CVSU email address.",
    );
  }

  return normalizedEmail;
};

//? pang register to, if mali logic tapon na natin
export const registerUser = async (email) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: validatedEmail,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) throw new Error(error.message);

  return data;
};

//? pang login if existing si user
export const loginUser = async (email) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: validatedEmail,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) throw new Error(error.message);

  return data;
};

//! pang OTP verification to!!!
export const verification = async (email, otp) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.verifyOtp({
    email: validatedEmail,
    token: otp.trim(),
    type: "email",
  });

  if (error) throw new Error(error.message);

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    throw new Error(error.message);
  }
  return true;
};
