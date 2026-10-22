import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Stays",
    template: "%s | SmartStay",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
