import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Modern, tiszta betűtípus
import "./globals.css";

// Betűtípus konfigurálása
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Munkavédelmi Műszaki Webshop | Profi Felszerelések",
  description: "Minőségi munkavédelmi ruházat, bakancsok és eszközök széles választéka. Ingyenes szállítás és garancia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${inter.className} antialiased bg-white text-black`}>
        {children}
      </body>
    </html>
  );
}