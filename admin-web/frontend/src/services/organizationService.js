
import { apiRequest } from "./api";
import supabase from "../lib/supabase";

//* get the logged-in admin access token
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

//* fetch all organizations
export const getOrganizations = async () => {
  const token = await getAccessToken();

  return apiRequest("/organizations", {}, token);
};

//* create a new organization
export const createOrganization = async (organizationData) => {
  const token = await getAccessToken();

  return apiRequest(
    "/organizations",
    {
      method: "POST",
      body: JSON.stringify(organizationData),
    },
    token
  );
};
