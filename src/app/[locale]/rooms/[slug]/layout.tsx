import type { Metadata } from "next";

import { useCases } from "@/infrastructure/container";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const room = await useCases.getRoom(params.slug);
    return { title: room.name || "Room details" };
  } catch {
    return { title: "Room details" };
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
