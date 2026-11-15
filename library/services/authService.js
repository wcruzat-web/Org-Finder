import supabase from "../supabase.js";


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

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    throw new Error(error.message);
  }
  return true;
};
