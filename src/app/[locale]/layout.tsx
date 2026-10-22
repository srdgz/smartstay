import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { resolveLocale } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { useCases } from "@/infrastructure/container";
import { NextAuthProvider } from "@/presentation/components/AuthProvider/AuthProvider";
import Footer from "@/presentation/components/Footer/Footer";
import Header from "@/presentation/components/Header/Header";
import ThemeProvider from "@/presentation/components/ThemeProvider/ThemeProvider";
import Toast from "@/presentation/components/Toast/Toast";
import { CurrencyProvider } from "@/presentation/context/CurrencyContext";
import { CURRENCY_COOKIE, resolveCurrency } from "@/presentation/lib/currencyPreference";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const t = await getTranslations({
    locale: resolveLocale(params.locale),
    namespace: "Metadata",
  });

  return {
    title: {
      default: t("defaultTitle"),
      template: "%s | SmartStay",
    },
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Common" });
  const rates = await useCases.getExchangeRates();
  const currency = resolveCurrency(cookies().get(CURRENCY_COOKIE)?.value, locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <NextIntlClientProvider>
          <CurrencyProvider initialCurrency={currency} rates={rates}>
            <NextAuthProvider>
              <ThemeProvider>
                <Toast />
                <a href="#main-content" className="skip-link">
                  {t("skipToContent")}
                </a>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main id="main-content" tabIndex={-1} className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ThemeProvider>
            </NextAuthProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
