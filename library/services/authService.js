import supabase from "../supabase.js";

export const registerAccount = async (email, password) => {
  const { data, error } = await supabase.from("accounts").insert({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

//* pang login na sha
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
