import supabaseAdmin from "../config/supabaseAdmin.js";

// assign a student as an organization officer
export const assignOrganizationOfficer = async (req, res) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const { student_id } = req.body;
    const studentId = Number(student_id);

    if (
      !Number.isSafeInteger(organizationId) ||
      organizationId <= 0 ||
      !Number.isSafeInteger(studentId) ||
      studentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid organization ID and student ID are required.",
      });
    }

    const { data, error } = await supabaseAdmin.rpc(
      "assign_organization_officer",
      {
        p_organization_id: organizationId,
        p_student_id: studentId,
      },
    );

    if (error) {
      console.error("Officer assignment error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Officer assigned successfully.",
      data,
    });
  } catch (error) {
    console.error("Officer assignment controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while assigning officer.",
    });
  }
};

// remove officer privileges while keeping membership
export const removeOrganizationOfficer = async (req, res) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const { student_id } = req.body;
    const studentId = Number(student_id);

    if (
      !Number.isSafeInteger(organizationId) ||
      organizationId <= 0 ||
      !Number.isSafeInteger(studentId) ||
      studentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid organization ID and student ID are required.",
      });
    }

    const { data, error } = await supabaseAdmin.rpc(
      "remove_organization_officer",
      {
        p_organization_id: organizationId,
        p_student_id: studentId,
      },
    );

    if (error) {
      console.error("Officer removal error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Officer assignment removed successfully.",
      data,
    });
  } catch (error) {
    console.error("Officer removal controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while removing officer.",
    });
  }
};

// retrieve organizations where the logged-in student is an officer
export const getMyOfficerOrganizations = async (req, res) => {
  try {
    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .select("id")
      .eq("auth_user_id", req.user.id)
      .eq("role", "student")
      .single();

    if (accountError || !account) {
      return res.status(404).json({
        success: false,
        message: "Student account not found.",
      });
    }

    // retrieve the active semester using the database date
    // retrieve the active semester from the database
    const { data: semesterId, error: semesterError } = await supabaseAdmin.rpc(
      "get_active_semester_id",
    );

    if (semesterError) throw semesterError;

    if (!semesterId) {
      return res.status(200).json({
        success: true,
        organizations: [],
      });
    }

    const { data: memberships, error: membershipError } = await supabaseAdmin
      .from("organization_members")
      .select("organization_id")
      .eq("student_id", account.id)
      .eq("semester_id", semesterId)
      .eq("role", "officer")
      .is("left_at", null);

    if (membershipError) throw membershipError;

    if (!memberships || memberships.length === 0) {
      return res.status(200).json({
        success: true,
        organizations: [],
      });
    }

    const organizationIds = memberships.map(
      (membership) => membership.organization_id,
    );

    const { data: organizations, error: organizationError } =
      await supabaseAdmin
        .from("organizations")
        .select("id, name, category, description")
        .in("id", organizationIds)
        .order("name");

    if (organizationError) throw organizationError;

    return res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    console.error("Get officer organizations error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving officer organizations.",
    });
  }
};



export const getOrganizationOfficers = async (req, res) => {
  try {
    const organizationId = Number(req.params.organizationId);

    if (!Number.isSafeInteger(organizationId) || organizationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid organization ID is required.",
      });
    }

    const { data: semesterId, error: semesterError } =
      await supabaseAdmin.rpc("get_active_semester_id");

    if (semesterError) throw semesterError;

    if (!semesterId) {
      return res.status(200).json({
        success: true,
        officers: [],
      });
    }

    const { data: memberships, error: membershipError } =
      await supabaseAdmin
        .from("organization_members")
        .select("id, student_id, joined_at")
        .eq("organization_id", organizationId)
        .eq("semester_id", semesterId)
        .eq("role", "officer")
        .is("left_at", null);

    if (membershipError) throw membershipError;

    if (!memberships || memberships.length === 0) {
      return res.status(200).json({
        success: true,
        officers: [],
      });
    }

    const studentIds = memberships.map((membership) => membership.student_id);

    const { data: students, error: studentError } = await supabaseAdmin
      .from("accounts")
      .select("id, full_name, email, course")
      .in("id", studentIds);

    if (studentError) throw studentError;

    const officers = memberships.map((membership) => ({
      membership_id: membership.id,
      joined_at: membership.joined_at,
      student: students.find(
        (student) => student.id === membership.student_id,
      ),
    }));

    return res.status(200).json({
      success: true,
      officers,
    });
  } catch (error) {
    console.error("Organization officers retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve organization officers.",
    });
  }
};
