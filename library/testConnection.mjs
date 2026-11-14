import supabase from "./supabase.js";

const testConnection = async () => {
  const { data, error } = await supabase
    .from("semesters")
    .select("id")
    .limit(1);

  console.log("Connection result:", { data, error });
};

testConnection();
