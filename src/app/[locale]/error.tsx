"use client";

import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  return (
    <div role="alert" className="container mx-auto">
      <h1 className="font-heading text-[#1D3557] dark:text-white mb-10">
        {t("title")}
      </h1>
      <button type="button" className="btn-primary" onClick={() => reset()}>
        {t("retry")}
      </button>
    </div>
  );
}
