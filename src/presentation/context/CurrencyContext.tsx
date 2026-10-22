"use client";

import { useLocale } from "next-intl";
import { createContext, useCallback, useMemo, useState } from "react";

import type { Currency } from "@/domain/money/Currency";
import { convertAmount } from "@/domain/money/Currency";
import type { ExchangeRates } from "@/domain/money/ExchangeRates";

import { currencyCookie } from "../lib/currencyPreference";
import { formatMoney } from "../lib/formatMoney";

export type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amountInBase: number) => number;
  format: (amountInBase: number) => string;
  formatIn: (amount: number, currency: Currency) => string;
};

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

type Props = {
  initialCurrency: Currency;
  rates: ExchangeRates;
  children: React.ReactNode;
};

export const CurrencyProvider = ({ initialCurrency, rates, children }: Props) => {
  const locale = useLocale();
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  const setCurrency = useCallback((next: Currency) => {
    document.cookie = currencyCookie(next);
    setCurrencyState(next);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const convert = (amountInBase: number) =>
      convertAmount(amountInBase, rates.rates[currency]);

    return {
      currency,
      setCurrency,
      convert,
      format: (amountInBase) => formatMoney(convert(amountInBase), currency, locale),
      formatIn: (amount, target) => formatMoney(amount, target, locale),
    };
  }, [currency, locale, rates, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
