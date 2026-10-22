import type { Metadata } from "next";

import { pageTitle } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return { title: await pageTitle(params.locale, "profile") };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
