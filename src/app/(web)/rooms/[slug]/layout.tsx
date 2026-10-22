import type { Metadata } from "next";

import { getRoom } from "@/libs/apis";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const room = await getRoom(params.slug);
    return { title: room?.name ?? "Room details" };
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
