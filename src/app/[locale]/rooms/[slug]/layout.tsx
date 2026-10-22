import type { Metadata } from "next";

import { pageTitle, resolveLocale } from "@/i18n/metadata";
import { useCases } from "@/infrastructure/container";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const room = await useCases.getRoom(params.slug, resolveLocale(params.locale));
    return { title: room.name || (await pageTitle(params.locale, "roomDetails")) };
  } catch {
    return { title: await pageTitle(params.locale, "roomDetails") };
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
