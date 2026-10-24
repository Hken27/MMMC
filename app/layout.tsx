import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "./components/navbar/navbar";
import idMessages from "../messages/id.json";
import enMessages from "../messages/en.json";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "id";
  const validLocales = ["id", "en"];
  const lang = validLocales.includes(locale) ? locale : "id";

  const messagesMap: Record<string, typeof idMessages> = {
    id: idMessages,
    en: enMessages,
  };
  const messages = messagesMap[lang];

  return (
    <html
      lang={lang}
      dir="ltr"
      className={`${geistSans.variable} ${interSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-svh flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
              <Navbar />
            </header>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}