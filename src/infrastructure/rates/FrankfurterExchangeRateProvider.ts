import type {
  ExchangeRateProvider,
  ExchangeRates,
} from "@/domain/money/ExchangeRates";

type Fetcher = (
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } }
) => Promise<Pick<Response, "ok" | "json">>;

type Options = {
  fallbackUsdToEur: number;
  fetcher?: Fetcher;
  timeoutMs?: number;
  revalidateSeconds?: number;
};

const ENDPOINT = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR";

export class FrankfurterExchangeRateProvider implements ExchangeRateProvider {
  constructor(private readonly options: Options) {}

  private fallback(): ExchangeRates {
    return {
      base: "USD",
      rates: { USD: 1, EUR: this.options.fallbackUsdToEur },
      date: "",
      source: "fallback",
    };
  }

  async getRates(): Promise<ExchangeRates> {
    const {
      fetcher = fetch as Fetcher,
      timeoutMs = 4000,
      revalidateSeconds = 12 * 60 * 60,
    } = this.options;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetcher(ENDPOINT, {
        signal: controller.signal,
        next: { revalidate: revalidateSeconds },
      });
      if (!response.ok) return this.fallback();

      const body = (await response.json()) as {
        date?: string;
        rates?: { EUR?: unknown };
      };
      const eur = body.rates?.EUR;
      if (typeof eur !== "number" || !Number.isFinite(eur) || eur <= 0) {
        return this.fallback();
      }

      return {
        base: "USD",
        rates: { USD: 1, EUR: eur },
        date: body.date ?? "",
        source: "live",
      };
    } catch {
      return this.fallback();
    } finally {
      clearTimeout(timer);
    }
  }
}
