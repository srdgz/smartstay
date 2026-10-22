import type { Metadata } from "next";

import { pageTitle } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: {
      default: await pageTitle((await params).locale, "stays"),
      template: "%s | SmartStay",
    },
  };
}

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
