"use client";

import { useTranslations } from "next-intl";

import Form from "@/presentation/components/Form/Form";

const Contact = () => {
  const t = useTranslations("Contact");

  return (
    <div className="page-container py-10 sm:py-16">
      <h1 className="mx-auto mb-8 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">{t("title")}</h1>
      <Form />
    </div>
  );
};

export default Contact;
