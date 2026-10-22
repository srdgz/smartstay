import type { ExchangeRateProvider } from "@/domain/money/ExchangeRates";

export const makeGetExchangeRates =
  ({ rates }: { rates: ExchangeRateProvider }) =>
  () =>
    rates.getRates();
