import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halısaha Organizasyonu",
  description: "Halısaha takım organizasyonu uygulaması",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
