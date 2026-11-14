import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const testConnection = {
  supabaseUrl: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL)
}

console.log("Supabase URL is set:", testConnection.supabaseUrl);