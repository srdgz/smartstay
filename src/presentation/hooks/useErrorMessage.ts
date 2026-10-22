import { useTranslations } from "next-intl";

import { getErrorMessage } from "../lib/errorMessage";

export const useErrorMessage = () => {
  const t = useTranslations("Errors");

  return (error: unknown, fallback: string) =>
    getErrorMessage(error, fallback, {
      has: (code) => t.has(code as never),
      message: (code, params) => t(code as never, params as never),
      network: t("network"),
    });
};
