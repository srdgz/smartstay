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
        className="rounded border border-gray-500 bg-white px-2 py-1 text-sm text-black dark:bg-[#212529] dark:text-white"
      >
        <option value="USD">{t("usd")}</option>
        <option value="EUR">{t("eur")}</option>
      </select>
    </div>
  );
};

export default CurrencySwitcher;
