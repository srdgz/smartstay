import { isCurrency, type Currency } from "@/domain/money/Currency";

export const CURRENCY_COOKIE = "NEXT_CURRENCY";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export const defaultCurrencyFor = (locale: string): Currency =>
  locale === "es" ? "EUR" : "USD";

export const resolveCurrency = (stored: string | undefined, locale: string): Currency =>
  isCurrency(stored) ? stored : defaultCurrencyFor(locale);

export const currencyCookie = (currency: Currency) =>
  `${CURRENCY_COOKIE}=${currency}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
