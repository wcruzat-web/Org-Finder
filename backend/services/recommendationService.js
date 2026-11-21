const supabase = require("./supabaseService");
const { generateRecommendation } = require("./groqService");

function getManilaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getDailyRecommendation(accessToken) {
  // 1. authenticate the logged-in user.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    throw new Error("Unauthorized. Please log in again.");
  }

  // 2. retrieve the student's account.
  const { data: student, error: studentError } = await supabase
    .from("accounts")
    .select("id, full_name, course, role")
    .eq("auth_user_id", user.id)
    .single();

  if (studentError || !student) {
    throw new Error("Student account not found.");
  }

  if (student.role !== "student" || !student.course) {
    throw new Error("Only registered students can receive recommendations.");
  }

  const today = getManilaDate();

  // 3. check today's saved recommendations.
  const { data: savedRecommendations, error: savedError } = await supabase
    .from("daily_recommendations")
    .select(
      `
      organization_id,
      recommendation_reason,
      organizations (
        id,
        name,
        category,
        description
      )
    `,
    )
    .eq("student_id", student.id)
    .eq("recommendation_date", today);

  if (savedError) {
    throw savedError;
  }

  // return the cached recommendations if exactly three exist.
  if (savedRecommendations?.length === 3) {
    return {
      recommendations: savedRecommendations.map((item) => ({
        ...item.organizations,
        reason: item.recommendation_reason,
      })),
      cached: true,
    };
  }

  // remove incomplete cached recommendations before regenerating.
  if (savedRecommendations?.length > 0) {
    const { error: deleteError } = await supabase
      .from("daily_recommendations")
      .delete()
      .eq("student_id", student.id)
      .eq("recommendation_date", today);

    if (deleteError) {
      throw deleteError;
    }
  }

  // 4. find the current semester.
  const { data: semester, error: semesterError } = await supabase
    .from("semesters")
    .select("id")
    .lte("starts_on", today)
    .gte("ends_on", today)
    .maybeSingle();

  if (semesterError) {
    throw semesterError;
  }

  if (!semester) {
    throw new Error("No active semester found.");
  }

  // 5. retrieve the student's active memberships this semester.
  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("student_id", student.id)
    .eq("semester_id", semester.id)
    .is("left_at", null);

  if (membershipError) {
    throw membershipError;
  }

  const joinedOrganizationIds = new Set(
    (memberships || []).map((membership) => String(membership.organization_id)),
  );

  // 6. retrieve organizations.
  const { data: allOrganizations, error: organizationError } =
    await supabase.from("organizations").select(`
        id,
        name,
        category,
        description,
        course_eligibility,
        eligible_courses
      `);

  if (organizationError) {
    throw organizationError;
  }

  // 7. retrieve active membership counts for this semester.
  const { data: allMemberships, error: countError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("semester_id", semester.id)
    .is("left_at", null);

  if (countError) {
    throw countError;
  }

  const memberCounts = {};

  (allMemberships || []).forEach((membership) => {
    const id = String(membership.organization_id);
    memberCounts[id] = (memberCounts[id] || 0) + 1;
  });

  // 8. filter eligible organizations.
  const eligibleOrganizations = (allOrganizations || [])
    .filter((organization) => {
      const isCourseEligible =
        organization.course_eligibility === "all" ||
        (organization.course_eligibility === "specific" &&
          (organization.eligible_courses || []).includes(student.course));

      const hasNotJoined = !joinedOrganizationIds.has(String(organization.id));

      return isCourseEligible && hasNotJoined;
    })
    .map((organization) => ({
      id: organization.id,
      name: organization.name,
      category: organization.category,
      description: organization.description,
      memberCount: memberCounts[String(organization.id)] || 0,
    }));

  if (eligibleOrganizations.length < 3) {
    throw new Error(
      "At least three eligible organizations are required for recommendations.",
    );
  }

  // 9. generate three recommendations using groq.
  const aiResult = await generateRecommendation(
    {
      fullName: student.full_name,
      course: student.course,
    },
    eligibleOrganizations,
  );

  const aiRecommendations = aiResult.recommendations;

  // 10. validate the ai response.
  if (!Array.isArray(aiRecommendations) || aiRecommendations.length !== 3) {
    throw new Error("AI must return exactly three recommendations.");
  }

  const recommendationIds = aiRecommendations.map((item) =>
    String(item.organization_id),
  );

  if (new Set(recommendationIds).size !== 3) {
    throw new Error("AI returned duplicate organization recommendations.");
  }

  const selectedRecommendations = aiRecommendations.map((item) => {
    const organization = eligibleOrganizations.find(
      (org) => String(org.id) === String(item.organization_id),
    );

    if (!organization) {
      throw new Error("AI returned an invalid organization recommendation.");
    }

    if (typeof item.reason !== "string" || !item.reason.trim()) {
      throw new Error("AI returned an invalid recommendation reason.");
    }

    return {
      ...organization,
      reason: item.reason.trim(),
    };
  });

  // 11. save all three recommendations.
  const recordsToInsert = selectedRecommendations.map((organization) => ({
    student_id: student.id,
    organization_id: organization.id,
    recommendation_reason: organization.reason,
    recommendation_date: today,
  }));

  const { error: insertError } = await supabase
    .from("daily_recommendations")
    .insert(recordsToInsert);

  if (insertError) {
    // another request may have saved today's recommendations first.
    if (insertError.code === "23505") {
      const { data: existing, error: existingError } = await supabase
        .from("daily_recommendations")
        .select(
          `
          organization_id,
          recommendation_reason,
          organizations (
            id,
            name,
            category,
            description
          )
        `,
        )
        .eq("student_id", student.id)
        .eq("recommendation_date", today);

      if (existingError) {
        throw existingError;
      }

      if (existing?.length === 3) {
        return {
          recommendations: existing.map((item) => ({
            ...item.organizations,
            reason: item.recommendation_reason,
          })),
          cached: true,
        };
      }
    }

    throw insertError;
  }

  return {
    recommendations: selectedRecommendations,
    cached: false,
  };
}

module.exports = {
  getDailyRecommendation,
};
