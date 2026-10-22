import axios from "axios";

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }
    const data = error.response.data;
    if (typeof data === "string" && data.trim()) return data;
  }
  return fallback;
};
