
import { apiRequest } from "./api";
import supabase from "../lib/supabase";

const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  return session.access_token;
};

export const getSemesters = async () => {
  const token = await getAccessToken();
  return apiRequest("/semesters", {}, token);
};

export const createSemester = async (semester) => {
  const token = await getAccessToken();

  return apiRequest(
    "/semesters",
    {
      method: "POST",
      body: JSON.stringify(semester),
    },
    token,
  );
};

export const updateSemester = async (id, semester) => {
  const token = await getAccessToken();

  return apiRequest(
    `/semesters/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(semester),
    },
    token,
  );
};
