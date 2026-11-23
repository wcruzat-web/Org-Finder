
import supabaseAdmin from "../config/supabaseAdmin.js";

//* get all organizations
export const getOrganizations = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select(`
        id,
        name,
        category,
        description,
        account_id,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      organizations: data,
    });
  } catch (error) {
    console.error("get organizations error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//* create a new organization
export const createOrganization = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "organization name and category are required.",
      });
    }

    //* validate organization category
    const validCategories = [
      "academic",
      "non_academic",
      "religious",
      "performing_arts",
      "student_council",
      "high_school",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "invalid organization category.",
      });
    }

    //* insert organization into database
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .insert({
        name: name.trim(),
        category,
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "organization created successfully.",
      organization: data,
    });
  } catch (error) {
    console.error("create organization error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
