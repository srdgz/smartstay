import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import type { Currency } from "@/domain/money/Currency";
import type { ExchangeRates } from "@/domain/money/ExchangeRates";
import { CurrencyProvider } from "@/presentation/context/CurrencyContext";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

const messages = { en, es };
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const defaultRates: ExchangeRates = {
  base: "USD",
  rates: { USD: 1, EUR: 0.9 },
  date: "2026-10-22",
  source: "live",
};

type Options = {
  locale?: keyof typeof messages;
  currency?: Currency;
  rates?: ExchangeRates;
};

export const renderWithProviders = (
  ui: React.ReactElement,
  { locale = "en", currency = "USD", rates = defaultRates }: Options = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone={timeZone}>
      <CurrencyProvider initialCurrency={currency} rates={rates}>
        {children}
      </CurrencyProvider>
    </NextIntlClientProvider>
  );

  return render(ui, { wrapper: Wrapper });
};
