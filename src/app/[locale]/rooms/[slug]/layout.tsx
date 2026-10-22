import type { Metadata } from "next";

import { pageTitle, resolveLocale } from "@/i18n/metadata";
import { useCases } from "@/infrastructure/container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const room = await useCases.getRoom(slug, resolveLocale(locale));
    return { title: room.name || (await pageTitle(locale, "roomDetails")) };
  } catch {
    return { title: await pageTitle(locale, "roomDetails") };
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
