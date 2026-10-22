import { describe, expect, it, vi } from "vitest";

import { FrankfurterExchangeRateProvider } from "./FrankfurterExchangeRateProvider";

const provider = (fetcher: ConstructorParameters<typeof FrankfurterExchangeRateProvider>[0]["fetcher"]) =>
  new FrankfurterExchangeRateProvider({ fallbackUsdToEur: 0.9, fetcher });

const reply = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: async () => body });

describe("FrankfurterExchangeRateProvider", () => {
  it("returns the live rate when the service answers", async () => {
    const rates = await provider(reply({ date: "2026-10-22", rates: { EUR: 0.86 } })).getRates();

    expect(rates).toEqual({
      base: "USD",
      rates: { USD: 1, EUR: 0.86 },
      date: "2026-10-22",
      source: "live",
    });
  });

  it("asks for a cached, time-limited response", async () => {
    const fetcher = reply({ rates: { EUR: 0.86 } });
    await provider(fetcher).getRates();

    expect(fetcher).toHaveBeenCalledWith(
      expect.stringContaining("base=USD&symbols=EUR"),
      expect.objectContaining({ signal: expect.any(AbortSignal), next: { revalidate: 43200 } })
    );
  });

  it.each([
    ["an error status", reply({}, false)],
    ["a missing rate", reply({ rates: {} })],
    ["a non-numeric rate", reply({ rates: { EUR: "0.9" } })],
    ["a zero rate", reply({ rates: { EUR: 0 } })],
    ["a network failure", vi.fn().mockRejectedValue(new Error("offline"))],
  ])("falls back to the configured rate on %s", async (_label, fetcher) => {
    const rates = await provider(fetcher).getRates();

    expect(rates.source).toBe("fallback");
    expect(rates.rates).toEqual({ USD: 1, EUR: 0.9 });
  });
});
