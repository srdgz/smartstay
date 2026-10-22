import type { Currency } from "./Currency";

export type ExchangeRates = {
  base: Currency;
  rates: Record<Currency, number>;
  date: string;
  source: "live" | "fallback";
};

export interface ExchangeRateProvider {
  getRates(): Promise<ExchangeRates>;
}
