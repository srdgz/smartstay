export const CURRENCIES = ["USD", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const BASE_CURRENCY: Currency = "USD";

export const isCurrency = (value: unknown): value is Currency =>
  typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);

export const convertAmount = (amountInBase: number, rate: number) =>
  amountInBase * rate;
