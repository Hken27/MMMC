/**
 * i18n navigation helper — set cookie locale untuk bahasa situs.
 * Arsitektur tanpa prefix URL: bahasa disimpan di cookie `NEXT_LOCALE`,
 * dibaca oleh `src/i18n/request.ts` dan `getLocale()`.
 * Setelah set cookie, reload halaman agar konten server-render berganti.
 */

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function setLocaleCookie(locale: Locale) {
  // Cookie: 1 tahun (365 hari), path=/, tanpa Secure (agar jalan di http localhost)
  document.cookie = `NEXT_LOCALE=${locale}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax`;
  // Reload agar server re-render dengan locale baru
  window.location.reload();
}