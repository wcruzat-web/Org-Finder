import supabase from "../supabase.js";

//* validation ng email
export const validateEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@cvsu\.edu\.ph$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new Error(
      "Invalid email format. Please use a valid CVSU email address.",
    );
  }

  return normalizedEmail;
};

//? register user
export const registerUser = async (email, password) => {
  const validatedEmail = validateEmail(email);

  if (!password) {
    throw new Error("Password is required.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: validatedEmail,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

//! do not touch by touch

export const createStudentAccount = async (fullName, course) => {
  const normalizedFullName = fullName.trim();
  const normalizedCourse = course.trim();

  if (!normalizedFullName || !normalizedCourse) {
    throw new Error("Full name and course are required.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);

  if (!user || !user.email) {
    throw new Error("User not found!");
  }

  const validatedEmail = validateEmail(user.email);

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      auth_user_id: user.id,
      email: validatedEmail,
      full_name: normalizedFullName,
      course: normalizedCourse,
    })
    .select()
    .single();

  if (error) {
    console.log("Account Insert Error:", error);
    throw new Error(error.message);
  }

  return data;
};

//? verification
export const verification = async (email, otp) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.verifyOtp({
    email: validatedEmail,
    token: otp,
    type: "email",
  });

  if (error) throw new Error(error.message);

  return data;
};

//? login hey
export const loginUser = async (email, password) => {
  const validatedEmail = validateEmail(email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validatedEmail,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
};
