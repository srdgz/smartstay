"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useRouter } from "@/i18n/navigation";
import { notifyError } from "@/presentation/lib/notify";

const defaultFormData = {
  name: "",
  email: "",
  password: "",
};

const knownSignInErrors = [
  "OAuthAccountNotLinked",
  "CredentialsSignin",
  "AccessDenied",
] as const;

const Auth = () => {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [formData, setFormData] = useState(defaultFormData);
  const inputStyles =
    "border border-gray-300 sm:text-sm text-black placeholder:text-gray-600 rounded-lg block w-full p-2.5";

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [router, session]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (!code) return;

    const known = knownSignInErrors.find((error) => error === code);
    notifyError(t(`errors.${known ?? "Default"}`), code);
  }, [t]);

  const loginHandler = async (provider?: string) => {
    try {
      await signIn(provider, { callbackUrl: `/${locale}` });
    } catch (error) {
      notifyError(t("errors.Default"));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await signUp(formData);
      if (user) {
        toast.success(t("accountCreated"));
        setFormData(defaultFormData);
      }
    } catch (error) {
      notifyError(t("signUpFailed"));
    }
  };

  return (
    <section className="container mx-auto">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 md:w-[70%] mx-auto">
        <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            {t("createAccount")}
          </h1>
          <p>{t("or")}</p>
          <span className="inline-flex items-center">
            <button
              type="button"
              onClick={() => loginHandler("github")}
              aria-label={t("signInGithub")}
              className="mr-3"
            >
              <AiFillGithub
                aria-hidden="true"
                className="text-4xl text-black dark:text-white"
              />
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => loginHandler("google")}
              aria-label={t("signInGoogle")}
              className="ml-3"
            >
              <FcGoogle aria-hidden="true" className="text-4xl" />
            </button>
          </span>
        </div>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <label htmlFor="auth-name" className="sr-only">
            {t("name")}
          </label>
          <input
            id="auth-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            required
            className={inputStyles}
            value={formData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="auth-email" className="sr-only">
            {t("email")}
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            required
            className={inputStyles}
            value={formData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="auth-password" className="sr-only">
            {t("password")}
          </label>
          <input
            id="auth-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            required
            minLength={8}
            className={inputStyles}
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="w-full bg-tertiary-dark text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {t("signUp")}
          </button>
        </form>
        <button
          type="button"
          onClick={() => loginHandler()}
          className="text-blue-700 underline dark:text-blue-300"
        >
          {t("signIn")}
        </button>
      </div>
    </section>
  );
};

export default Auth;
