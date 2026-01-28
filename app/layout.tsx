import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// IMPORTÁLJUK BE AZ ÚJ KOMPONENST
import AutoLogout from "./components/AutoLogout"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Munkavédelem Webshop",
  description: "Prémium munkavédelmi eszközök",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        
        {/* IDE TESSZÜK BE, HOGY MINDIG FUSSON */}
        <AutoLogout />
        
        {children}
      </body>
    </html>
  );
}