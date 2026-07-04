import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashtavakra Maha Geeta — Osho",
  description: "91 discourses on the Ashtavakra Gita by Osho. A portal to the teachings on consciousness, liberation, and the nature of the Self.",
  openGraph: {
    title: "Ashtavakra Maha Geeta — Osho",
    description: "91 discourses on the Ashtavakra Gita by Osho.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
