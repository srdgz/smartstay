"use client";

import { useTranslations } from "next-intl";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Link } from "@/i18n/navigation";
import ThemeContext from "@/presentation/context/themeContext";

import CurrencySwitcher from "../CurrencySwitcher/CurrencySwitcher";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const Header = () => {
  const t = useTranslations("Header");
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data: session } = useSession();

  const toggleTheme = () => {
    if (darkTheme) localStorage.removeItem("hotel-theme");
    else localStorage.setItem("hotel-theme", "true");
    setDarkTheme(!darkTheme);
  };

  return (
    <header className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
      <div className="flex flex-wrap items-center gap-3 w-full md:2/3">
        <Link
          href="/"
          className="font-black text-tertiary-dark dark:text-tertiary-darkmode"
        >
          SmartStay
        </Link>
        <ul className="flex items-center gap-3 ml-2">
          <li className="flex items-center">
            {session?.user ? (
              <Link
                href={`/users/${session.user.id}`}
                aria-label={t("myProfile")}
              >
                {session.user.image ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={session.user.image}
                      alt=""
                      width={40}
                      height={40}
                      className="scale-animation img"
                    />
                  </div>
                ) : (
                  <FaUserCircle aria-hidden="true" />
                )}
              </Link>
            ) : (
              <Link href="/auth" aria-label={t("signIn")}>
                <FaUserCircle aria-hidden="true" />
              </Link>
            )}
          </li>
          <li>
            <button
              type="button"
              aria-label={t("darkMode")}
              aria-pressed={darkTheme}
              onClick={toggleTheme}
            >
              {darkTheme ? (
                <MdOutlineLightMode aria-hidden="true" />
              ) : (
                <MdDarkMode aria-hidden="true" />
              )}
            </button>
          </li>
          <li>
            <LanguageSwitcher />
          </li>
          <li>
            <CurrencySwitcher />
          </li>
        </ul>
      </div>
      <nav aria-label={t("mainNav")} className="w-full md:w-1/2 lg:w-1/3 mt-4">
        <ul className="flex items-center justify-between gap-4">
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/">{t("home")}</Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/rooms">{t("stays")}</Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/contact">{t("contact")}</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
