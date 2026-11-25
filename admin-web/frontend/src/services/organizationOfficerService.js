
import { apiRequest } from "./api";
import supabase from "../lib/supabase";

const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session) {
    throw new Error("No active session. Please log in again.");
  }

  return session.access_token;
};

// retrieve officers assigned to an organization
export const getOrganizationOfficers = async (organizationId) => {
  const token = await getAccessToken();

  return apiRequest(
    `/organizations/${organizationId}/officers`,
    {},
    token
  );
};

// search existing student accounts
export const searchStudentAccounts = async (query) => {
  const token = await getAccessToken();

  return apiRequest(
    `/organizations/students/search?q=${encodeURIComponent(query)}`,
    {},
    token
  );
};

// assign a student as an organization officer
export const assignOrganizationOfficer = async (
  organizationId,
  studentId
) => {
  const token = await getAccessToken();

  return apiRequest(
    `/organizations/${organizationId}/officers`,
    {
      method: "POST",
      body: JSON.stringify({
        student_id: studentId,
      }),
    },
    token
  );
};

// remove officer privileges while keeping membership
export const removeOrganizationOfficer = async (
  organizationId,
  studentId
) => {
  const token = await getAccessToken();

  return apiRequest(
    `/organizations/${organizationId}/officers`,
    {
      method: "DELETE",
      body: JSON.stringify({
        student_id: studentId,
      }),
    },
    token
  );
};
