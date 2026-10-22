import axios from "axios";

export type ErrorTranslations = {
  has: (code: string) => boolean;
  message: (code: string, params?: Record<string, string | number>) => string;
  network: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback: string,
  translations: ErrorTranslations
) => {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return translations.network;

  const data = error.response.data;
  if (data && typeof data === "object" && typeof data.code === "string") {
    if (translations.has(data.code)) {
      return translations.message(data.code, data.params ?? {});
    }
  }

  return fallback;
};
