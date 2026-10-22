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
    <section className="page-container py-10 sm:py-16">
      <div className="card mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("createAccount")}
        </h1>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => loginHandler("github")}
            className="btn-outline w-full"
          >
            <AiFillGithub aria-hidden="true" className="text-2xl" />
            {t("signInGithub")}
          </button>
          <button
            type="button"
            onClick={() => loginHandler("google")}
            className="btn-outline w-full"
          >
            <FcGoogle aria-hidden="true" className="text-2xl" />
            {t("signInGoogle")}
          </button>
        </div>

        <p className="text-muted my-6 flex items-center gap-4 text-sm">
          <span aria-hidden="true" className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
          {t("or")}
          <span aria-hidden="true" className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            className="field"
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
            className="field"
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
            className="field"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn-primary w-full">
            {t("signUp")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => loginHandler()}
          className="mt-6 w-full text-center font-semibold text-blue-700 underline dark:text-blue-300"
        >
          {t("signIn")}
        </button>
      </div>
    </section>
  );
};

export default Auth;
