import { useTranslations } from "next-intl";

const NewsLetter = () => {
  const t = useTranslations("Newsletter");

  return (
    <section className="page-container">
      <form className="flex flex-col items-center justify-center rounded-4xl bg-secondary px-4 py-12 text-center text-ink dark:bg-neutral-900 dark:text-neutral-100 md:py-20">
        <p className="text-muted mb-3 text-base font-medium md:text-lg">{t("eyebrow")}</p>
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>

        <div className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            {t("emailLabel")}
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailLabel")}
            className="field flex-1"
          />
          <button type="button" className="btn-primary">
            {t("subscribe")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewsLetter;
