import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "./routing";

type TitleKey = "stays" | "contact" | "auth" | "profile" | "roomDetails";

export const resolveLocale = (locale: string) =>
  hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

export const pageTitle = async (locale: string, key: TitleKey) => {
  const t = await getTranslations({
    locale: resolveLocale(locale),
    namespace: "Metadata",
  });
  return t(key);
};
