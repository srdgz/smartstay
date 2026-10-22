"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";

import { isCurrency } from "@/domain/money/Currency";
import { useMoney } from "@/presentation/hooks/useMoney";

const CurrencySwitcher = () => {
  const t = useTranslations("Switchers");
  const { currency, setCurrency } = useMoney();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isCurrency(event.target.value)) setCurrency(event.target.value);
  };

  return (
    <div>
      <label htmlFor="currency-switcher" className="sr-only">
        {t("currency")}
      </label>
      <select
        id="currency-switcher"
        value={currency}
        onChange={handleChange}
        className="h-10 cursor-pointer rounded-full border border-gray-300 bg-white px-3 text-sm font-medium text-ink transition hover:bg-gray-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <option value="USD">{t("usd")}</option>
        <option value="EUR">{t("eur")}</option>
      </select>
    </div>
  );
};

export default CurrencySwitcher;
