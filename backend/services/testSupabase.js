const supabase = require("./supabaseService");

async function testSupabase() {
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name")
    .limit(5);

  if (error) {
    console.error(`Error fetching organizations: ${error.message}`);
    return;
  }

  console.log("Supabase successfully connected.");
  console.log("Fetched organizations:", data);
}
testSupabase();
