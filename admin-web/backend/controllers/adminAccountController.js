import supabaseAdmin from "../config/supabaseAdmin.js";

export const createAdminAccount = async (req, res) => {
  let authUserId = null;

  try {
    const setupSecret = req.headers["x-admin-setup-secret"];

    if (!setupSecret || setupSecret !== process.env.ADMIN_SETUP_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid or missing admin setup secret.",
      });
    }
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and full name are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Check whether an admin account already exists
    const { count, error: countError } = await supabaseAdmin
      .from("accounts")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) throw countError;

    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: "An admin account already exists.",
      });
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    authUserId = authData.user.id;

    // Create admin account record
    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .insert({
        auth_user_id: authUserId,
        email,
        full_name,
        role: "admin",
        course: null,
      })
      .select()
      .single();

    if (accountError) throw accountError;

    return res.status(201).json({
      success: true,
      message: "Initial admin account created successfully.",
      account,
    });
  } catch (error) {
    // Roll back Auth user if database insertion fails
    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const searchStudentAccounts = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.status(200).json({
        success: true,
        students: [],
      });
    }

    const { data: students, error } = await supabaseAdmin
      .from("accounts")
      .select("id, full_name, email, course")
      .eq("role", "student")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order("full_name")
      .limit(20);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      students: students || [],
    });
  } catch (error) {
    console.error("Student search error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search student accounts.",
    });
  }
};
