
import supabaseAdmin from "../config/supabaseAdmin.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const { data: account, error } = await supabaseAdmin
      .from("accounts")
      .select("role")
      .eq("auth_user_id", req.user.id)
      .single();

    if (error || !account) {
      return res.status(403).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    if (account.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while checking admin access.",
    });
  }
};
