import supabaseAdmin from "../config/supabaseAdmin.js";

//* get all organizations
export const getOrganizations = async (req, res) => {
  try {
    //* fetch organizations
    const { data: organizations, error: organizationsError } =
      await supabaseAdmin
        .from("organizations")
        .select(
          `
          id,
          name,
          category,
          description,
          account_id,
          course_eligibility,
          eligible_courses,
          created_at
        `,
        )
        .order("created_at", { ascending: false });

    if (organizationsError) throw organizationsError;

    //* fetch current semester member counts
    const { data: memberCounts, error: countsError } = await supabaseAdmin.rpc(
      "get_organization_member_counts",
    );

    if (countsError) throw countsError;

    //* map member counts to organizations
    const countMap = new Map(
      memberCounts.map((item) => [
        item.organization_id,
        Number(item.member_count),
      ]),
    );

    const organizationsWithCounts = organizations.map((organization) => ({
      ...organization,
      member_count: countMap.get(organization.id) ?? 0,
    }));

    return res.status(200).json({
      success: true,
      organizations: organizationsWithCounts,
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
    const {
      name,
      category,
      description,
      course_eligibility,
      eligible_courses,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "organization name and category are required.",
      });
    }

    //* validate organization category
    const validCategories = [
      "Academic",
      "Non Academic",
      "Performing Arts",
      "Student Council",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "invalid organization category.",
      });
    }

    //* validate course eligibility
    if (!["all", "specific"].includes(course_eligibility)) {
      return res.status(400).json({
        success: false,
        message: "invalid course eligibility.",
      });
    }

    //* validate eligible courses
    const selectedCourses =
      course_eligibility === "all" ? [] : eligible_courses;

    if (!Array.isArray(selectedCourses)) {
      return res.status(400).json({
        success: false,
        message: "eligible courses must be an array.",
      });
    }

    if (course_eligibility === "specific" && selectedCourses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "select at least one eligible course.",
      });
    }

    //* insert organization into database
    const { data, error } = await supabaseAdmin
      .from("organizations")
      .insert({
        name: name.trim(),
        category,
        description: description?.trim() || null,
        course_eligibility,
        eligible_courses: selectedCourses,
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
