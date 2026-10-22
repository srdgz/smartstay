"use client";

import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { Link, usePathname } from "@/i18n/navigation";
import ThemeContext from "@/presentation/context/themeContext";
import { useCurrentUser } from "@/presentation/hooks/useApi";

import CurrencySwitcher from "../CurrencySwitcher/CurrencySwitcher";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const navItems = [
  { href: "/", key: "home" },
  { href: "/rooms", key: "stays" },
  { href: "/contact", key: "contact" },
] as const;

const iconButton =
  "grid h-10 w-10 place-items-center rounded-full border border-gray-300 text-xl transition hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800";

const Header = () => {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const { data: session } = useSession();
  const { data: profile } = useCurrentUser(Boolean(session?.user));
  const avatarUrl = profile?.image ?? session?.user?.image ?? null;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const toggleTheme = () => {
    if (darkTheme) localStorage.removeItem("hotel-theme");
    else localStorage.setItem("hotel-theme", "true");
    setDarkTheme(!darkTheme);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navLinks = (className: string, linkClass: string) => (
    <ul className={className}>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`${linkClass} ${
              isActive(item.href)
                ? "bg-gray-100 font-semibold dark:bg-neutral-800"
                : "hover:bg-gray-100 dark:hover:bg-neutral-800"
            }`}
          >
            {t(item.key)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const profileLink = session?.user ? (
    <Link
      href={`/users/${session.user.id}`}
      aria-label={t("myProfile")}
      className="block h-10 w-10 overflow-hidden rounded-full border border-gray-300 dark:border-neutral-600"
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt=""
          width={40}
          height={40}
          className="img"
        />
      ) : (
        <FaUserCircle className="h-full w-full" aria-hidden="true" />
      )}
    </Link>
  ) : (
    <Link href="/auth" aria-label={t("signIn")} className={iconButton}>
      <FaUserCircle aria-hidden="true" />
    </Link>
  );

  const themeButton = (
    <button
      type="button"
      aria-label={t("darkMode")}
      aria-pressed={darkTheme}
      onClick={toggleTheme}
      className={iconButton}
    >
      {darkTheme ? (
        <MdOutlineLightMode aria-hidden="true" />
      ) : (
        <MdDarkMode aria-hidden="true" />
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="page-container flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-tertiary-dark dark:text-tertiary-darkmode"
        >
          SmartStay
        </Link>

        <nav aria-label={t("mainNav")} className="hidden lg:block">
          {navLinks("flex items-center gap-1", "rounded-full px-4 py-2 text-base transition")}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <CurrencySwitcher />
          {themeButton}
          {profileLink}
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setMenuOpen((open) => !open)}
          className={`${iconButton} lg:hidden`}
        >
          {menuOpen ? <HiXMark aria-hidden="true" /> : <HiBars3 aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-gray-200 bg-white px-4 pb-6 pt-4 dark:border-neutral-800 dark:bg-neutral-950 lg:hidden"
        >
          <nav aria-label={t("mainNav")}>
            {navLinks("flex flex-col gap-1", "block rounded-xl px-4 py-3 text-lg transition")}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4 dark:border-neutral-800">
            <LanguageSwitcher />
            <CurrencySwitcher />
            {themeButton}
            {profileLink}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
