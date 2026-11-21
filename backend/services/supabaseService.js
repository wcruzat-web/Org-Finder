const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase URL or Service Role Key in environment variables",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

module.exports = supabase;
