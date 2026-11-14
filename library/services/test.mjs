import supabase from "../supabase.js";

const testConnection = async () => {
  const {data, error} = await supabase.from("semesters").limit(id).limit(1);
  
  if (error) {
    console.error("Connection test failed:", error.message);
    return;
  }

  console.log("Supabase connection successful:", data);
};

testConnection();
