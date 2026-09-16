import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CMMM — Premium Wood Charcoal Briquettes Exporter",
  description:
    "Premium quality wood charcoal briquettes for international B2B buyers. Sustainable, high-efficiency, and export-ready from Indonesia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${interSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <div className="flex min-h-svh flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
            <Navbar />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}