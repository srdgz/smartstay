"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LanguageSwitcher = () => {
  const t = useTranslations("Switchers");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const search = window.location.search;
    router.replace(`${pathname}${search}`, {
      locale: event.target.value as (typeof routing.locales)[number],
    });
  };

  return (
    <div>
      <label htmlFor="language-switcher" className="sr-only">
        {t("language")}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={handleChange}
        className="h-10 cursor-pointer rounded-full border border-gray-300 bg-white px-3 text-sm font-medium text-ink transition hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <option value="en">{t("english")}</option>
        <option value="es">{t("spanish")}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
