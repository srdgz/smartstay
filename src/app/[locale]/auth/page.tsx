"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { useRouter } from "@/i18n/navigation";
import PasswordField from "@/presentation/components/PasswordField/PasswordField";
import { notifyError } from "@/presentation/lib/notify";

type Mode = "signIn" | "signUp";

const defaultFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const knownSignInErrors = [
  "OAuthAccountNotLinked",
  "CredentialsSignin",
  "AccessDenied",
] as const;

const MIN_PASSWORD_LENGTH = 8;

const Auth = () => {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [mode, setMode] = useState<Mode>("signIn");
  const [formData, setFormData] = useState(defaultFormData);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signUp";
  const passwordsMismatch =
    isSignUp && formData.confirmPassword !== "" && formData.confirmPassword !== formData.password;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormData({ ...defaultFormData, email: formData.email });
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

  const loginHandler = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: `/${locale}` });
    } catch (error) {
      notifyError(t("errors.Default"));
    }
  };

  const handleSignIn = async () => {
    const result = await signIn("sanity-login", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      notifyError(t("errors.CredentialsSignin"));
      return;
    }
    router.push("/");
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) return;

    const { name, email, password } = formData;
    const user = await signUp({ name, email, password });
    if (user) {
      toast.success(t("accountCreated"));
      setMode("signIn");
      setFormData({ ...defaultFormData, email });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) await handleSignUp();
      else await handleSignIn();
    } catch (error) {
      notifyError(isSignUp ? t("signUpFailed") : t("errors.Default"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container py-10 sm:py-16">
      <div className="card mx-auto max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {isSignUp ? t("createAccount") : t("signInTitle")}
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
          {isSignUp && (
            <>
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
            </>
          )}
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
          <PasswordField
            id="auth-password"
            name="password"
            label={isSignUp ? t("password") : t("passwordLogin")}
            placeholder={t("passwordPlaceholder")}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={isSignUp ? MIN_PASSWORD_LENGTH : undefined}
            value={formData.password}
            onChange={handleInputChange}
          />
          {isSignUp && (
            <div>
              <PasswordField
                id="auth-confirm-password"
                name="confirmPassword"
                label={t("confirmPassword")}
                placeholder={t("confirmPasswordPlaceholder")}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                invalid={passwordsMismatch}
                describedBy={passwordsMismatch ? "auth-confirm-error" : undefined}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {passwordsMismatch && (
                <p
                  id="auth-confirm-error"
                  role="alert"
                  className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400"
                >
                  {t("passwordsDoNotMatch")}
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || passwordsMismatch}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <p className="text-muted mt-6 text-center">
          {isSignUp ? t("haveAccount") : t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => switchMode(isSignUp ? "signIn" : "signUp")}
            className="font-semibold text-blue-700 underline dark:text-blue-300"
          >
            {isSignUp ? t("signIn") : t("createAccount")}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
