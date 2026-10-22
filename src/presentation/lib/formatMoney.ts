import type { Currency } from "@/domain/money/Currency";

export const formatMoney = (amount: number, currency: Currency, locale: string) => {
  const rounded = Math.round(amount * 100) / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rounded);
};
