"use client";

import Link from "next/link";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import Image from "next/image";
import { useSession } from "next-auth/react";

import ThemeContext from "@/context/themeContext";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data: session } = useSession();

  const toggleTheme = () => {
    if (darkTheme) localStorage.removeItem("hotel-theme");
    else localStorage.setItem("hotel-theme", "true");
    setDarkTheme(!darkTheme);
  };

  return (
    <header className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
      <div className="flex items-center w-full md:2/3">
        <Link href="/" className="font-black text-tertiary-dark">
          SmartStay
        </Link>
        <ul className="flex items-center ml-5">
          <li className="flex items-center">
            {session?.user ? (
              <Link
                href={`/users/${session.user.id}`}
                aria-label="My profile"
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
              <Link href="/auth" aria-label="Sign in">
                <FaUserCircle aria-hidden="true" />
              </Link>
            )}
          </li>
          <li className="ml-2">
            <button
              type="button"
              aria-label="Dark mode"
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
        </ul>
      </div>
      <nav aria-label="Main" className="w-full md:w-1/2 lg:w-1/3 mt-4">
        <ul className="flex items-center justify-between">
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/rooms">Stays</Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
