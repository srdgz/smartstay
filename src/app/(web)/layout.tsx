import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/presentation/components/Header/Header";
import Footer from "@/presentation/components/Footer/Footer";
import ThemeProvider from "@/presentation/components/ThemeProvider/ThemeProvider";
import { NextAuthProvider } from "@/presentation/components/AuthProvider/AuthProvider";
import Toast from "@/presentation/components/Toast/Toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "SmartStay | Find your perfect refuge with just one click!",
    template: "%s | SmartStay",
  },
  description: "Your journey, your style, your choice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={poppins.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <Toast />
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <div className="font-normal">
              <Header />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
