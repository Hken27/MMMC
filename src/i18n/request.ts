import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";

/**
 * next-intl request config — TANPA locale prefix di URL.
 * Arsitektur single-page + anchor (#home, #produk, #service, #kontak)
 * & redirect 307 dipertahankan. Bahasa dibaca dari cookie `NEXT_LOCALE`
 * (di-set oleh LanguageSwitch), default "id".
 *
 * Bahasa tersedia (Phase 4):
 * id (Indonesia), en (English).
 */
export default getRequestConfig(async () => {
  let locale = "id";

  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (cookieLocale && ["id", "en"].includes(cookieLocale)) {
      locale = cookieLocale;
    }
  } catch {
    // cookies() kadang tidak tersedia di edge/build — fallback ke id
  }

  const messages: Record<string, unknown> = {
    id: idMessages,
    en: enMessages,
  };

  return {
    locale,
    messages: JSON.parse(JSON.stringify(messages[locale] || idMessages)),
  };
});