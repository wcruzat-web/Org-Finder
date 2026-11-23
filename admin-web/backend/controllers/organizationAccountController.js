import supabaseAdmin from "../config/supabaseAdmin.js";

// Get organizations without an assigned account
export const getAvailableOrganizations = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("id, name, category")
      .is("account_id", null)
      .order("name");

    if (error) throw error;

    return res.status(200).json({
      success: true,
      organizations: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all organization accounts
export const getOrganizationAccounts = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("accounts")
      .select(
        `
        id,
        email,
        role,
        full_name,
        organizations (id, name, category)
      `,
      )
      .eq("role", "organization")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      accounts: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create an organization account
export const createOrganizationAccount = async (req, res) => {
  let authUserId = null;

  try {
    const { organization_id, email, password } = req.body;

    if (!organization_id || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Organization, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Check organization
    const { data: organization, error: organizationError } = await supabaseAdmin
      .from("organizations")
      .select("id, name, account_id")
      .eq("id", organization_id)
      .single();

    if (organizationError || !organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
    }

    if (organization.account_id) {
      return res.status(409).json({
        success: false,
        message: "This organization already has an account.",
      });
    }

    // Create Supabase Auth user without email confirmation OTP
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    authUserId = authData.user.id;

    // Create account record
    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .insert({
        auth_user_id: authUserId,
        email,
        full_name: organization.name,
        role: "organization",
        course: null,
      })
      .select()
      .single();

    if (accountError) throw accountError;

    // Link account to organization
    const { error: linkError } = await supabaseAdmin
      .from("organizations")
      .update({ account_id: account.id })
      .eq("id", organization_id)
      .is("account_id", null);

    if (linkError) throw linkError;

    return res.status(201).json({
      success: true,
      message: "Organization account created successfully.",
      account,
    });
  } catch (error) {
    // Remove Auth user if database creation fails
    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
