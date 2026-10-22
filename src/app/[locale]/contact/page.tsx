"use client";

import { useTranslations } from "next-intl";

import Form from "@/presentation/components/Form/Form";

const Contact = () => {
  const t = useTranslations("Contact");

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-heading my-10">{t("title")}</h1>
      <Form />
    </div>
  );
};

export default Contact;
