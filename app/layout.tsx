import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Snapped - Premium Apparel & Accessories",
    template: "%s | Snapped",
  },
  description: "Discover premium quality apparel and accessories from Snapped. Shop hoodies, beanies, trucker hats, and more.",
  keywords: ["apparel", "clothing", "accessories", "hoodies", "beanies", "hats"],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://snapped.com",
    siteName: "Snapped",
    title: "Snapped - Premium Apparel & Accessories",
    description: "Discover premium quality apparel and accessories from Snapped.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col antialiased overflow-x-hidden ${firaCode.className}`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
