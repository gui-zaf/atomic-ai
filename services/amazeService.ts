import API_ENDPOINTS from "../config/api";

export const getAmazeSuggestion = async (): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINTS.amaze, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get suggestion");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error getting suggestion:", error);
    throw error;
  }
};
