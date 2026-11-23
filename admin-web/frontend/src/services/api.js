const API_BASE_URL = "https://org-finder.onrender.com/api";

export const apiRequest = async (endpoint, options = {}, accessToken) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};
