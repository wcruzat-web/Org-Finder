import supabase from "./supabase.js";

const testConnection = async () => {
  const { data, error } = await supabase.from("accounts").select("*").limit(1);

  if (error) {
    console.error("Connection test failed:", error.message);
    return;
  }

  console.log("Supabase connection successful:", data);
};

testConnection();
