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

// Register: sends a code and creates the user if they don't exist yet
export const registerUser = async (email) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.signInWithOtp({
    email: validatedEmail,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Login: sends a code only if the user already exists
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: validateEmail(email),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const loginWithOtp = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: validateEmail(email),
    options: { shouldCreateUser: false },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Verify: used by both register and login after the user enters the code
export const verifyOtp = async (email, token) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.verifyOtp({
    email: validatedEmail,
    token,
    type: "email",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // { user, session }
};

// Sets the password for the currently signed-in user (works right after verifyOtp)
export const setAccountPassword = async (password) => {
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

//? pang register to, if mali logic tapon na natin
// export const registerUser = async (email) => {
//   const validatedEmail = validateEmail(email);

//   const { data, error } = await supabase.auth.signInWithOtp({
//     email: validatedEmail,
//     options: {
//       shouldCreateUser: true,
//     },
//   });

//   if (error) throw new Error(error.message);

//   return data;
// };

// //? pang login if existing si user
// export const loginUser = async (email, password) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };

//aalisin ko to
// export const loginUser = async (email) => {
//   const validatedEmail = validateEmail(email);

//   const { data, error } = await supabase.auth.signInWithOtp({
//     email: validatedEmail,
//     options: {
//       shouldCreateUser: false,
//     },
//   });

//   if (error) throw new Error(error.message);

//   return data;
// };

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
