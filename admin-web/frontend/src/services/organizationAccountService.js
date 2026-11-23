import { apiRequest } from "./api";
import supabase from "../lib/supabase";

// get the logged-in admin's access token
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

// get organizations without linked accounts
export const getAvailableOrganizations = async () => {
  const token = await getAccessToken();

  return apiRequest(
    "/organization-accounts/available-organizations",
    {},
    token
  );
};

// get all organization accounts
export const getOrganizationAccounts = async () => {
  const token = await getAccessToken();

  return apiRequest("/organization-accounts", {}, token);
};

// create an organization account
export const createOrganizationAccount = async (accountData) => {
  const token = await getAccessToken();

  return apiRequest(
    "/organization-accounts",
    {
      method: "POST",
      body: JSON.stringify(accountData),
    },
    token
  );
};