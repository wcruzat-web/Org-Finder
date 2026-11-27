
import supabaseAdmin from "../config/supabaseAdmin.js";

export const getSemesters = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("semesters")
      .select("id, name, starts_on, ends_on, created_at")
      .order("starts_on", { ascending: false });

    if (error) {
      console.error("Get semesters error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve semesters.",
      });
    }

    return res.status(200).json({
      success: true,
      semesters: data,
    });
  } catch (error) {
    console.error("Get semesters error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const createSemester = async (req, res) => {
  try {
    const { name, starts_on, ends_on } = req.body;

    if (!name?.trim() || !starts_on || !ends_on) {
      return res.status(400).json({
        success: false,
        message: "Semester name, start date, and end date are required.",
      });
    }

    if (starts_on > ends_on) {
      return res.status(400).json({
        success: false,
        message: "The start date cannot be after the end date.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("semesters")
      .insert({
        name: name.trim(),
        starts_on,
        ends_on,
      })
      .select("id, name, starts_on, ends_on, created_at")
      .single();

    if (error) {
      console.error("Create semester error:", error);

      return res.status(400).json({
        success: false,
        message: error.message.includes("overlap")
          ? "This semester overlaps with an existing semester."
          : "Failed to create semester.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Semester created successfully.",
      semester: data,
    });
  } catch (error) {
    console.error("Create semester error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const updateSemester = async (req, res) => {
  try {
    const semesterId = Number(req.params.id);
    const { name, starts_on, ends_on } = req.body;

    if (!Number.isInteger(semesterId) || semesterId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester ID.",
      });
    }

    if (!name?.trim() || !starts_on || !ends_on) {
      return res.status(400).json({
        success: false,
        message: "Semester name, start date, and end date are required.",
      });
    }

    if (starts_on > ends_on) {
      return res.status(400).json({
        success: false,
        message: "The start date cannot be after the end date.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("semesters")
      .update({
        name: name.trim(),
        starts_on,
        ends_on,
      })
      .eq("id", semesterId)
      .select("id, name, starts_on, ends_on, created_at")
      .maybeSingle();

    if (error) {
      console.error("Update semester error:", error);

      return res.status(400).json({
        success: false,
        message: error.message.includes("overlap")
          ? "This semester overlaps with an existing semester."
          : "Failed to update semester.",
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Semester not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Semester updated successfully.",
      semester: data,
    });
  } catch (error) {
    console.error("Update semester error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
  