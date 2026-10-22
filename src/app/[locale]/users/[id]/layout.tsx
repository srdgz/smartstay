import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My profile",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
