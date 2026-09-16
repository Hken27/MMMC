import type { NextConfig } from "next";

/**
 * Security Hardening — Dev Agent (Phase 1)
 * ------------------------------------------------------------
 * Content Security Policy (CSP) ketat untuk memblok injeksi skrip
 * dari pihak ketiga / malformed. Plus header keamanan pelengkap.
 *
 * Trade-off yang disengaja (harus diketahui sebelum refactor nonce):
 * - `script-src 'unsafe-inline'`: Next.js menyisipkan script bootstrap
 *   inline untuk hydrate RSC. Menghilangkan ini butuh arsitektur NONCE
 *   via middleware (lihat refactor Fase 2).
 * - `style-src 'unsafe-inline'`: Tailwind v4 inject <style> inline saat dev.
 * - `unsafe-eval` & `ws:` HANYA di development (webpack/HMR) — otomatis
 *   dihapus pada production build.
 */
const isProd = process.env.NODE_ENV === "production";

const csp = [
  // Default: hanya sumber sendiri
  "default-src 'self'",

  // Script: sendiri + bootstrap inline Next.js. eval hanya di dev.
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,

  // Style: Tailwind inject <style> inline.
  "style-src 'self' 'unsafe-inline'",

  // Gambar: self + data URI + blob (image optimization Next.js).
  // ── NOTE: tambahkan host CDN/gambar pihak ketiga SECARA SADAR di sini,
  // ── jangan membuka lebar-lebar. Contoh nanti: https://images.unsplash.com
  "img-src 'self' data: blob:",

  // Font: next/font self-hosted saat build → same-origin cukup.
  "font-src 'self' data:",

  // Fetch/WS: same-origin; ws:// hanya untuk HMR dev.
  `connect-src 'self'${isProd ? "" : " ws: wss:"}`,

  // Form: submit hanya ke origin sendiri (cegah form-jacking).
  "form-action 'self'",

  // Block object/embed/iframe/plugin — tanpa pengecualian.
  "object-src 'none'",
  "frame-src 'none'",

  // Clickjacking protection.
  "frame-ancestors 'none'",

  // Base URI dibatasi origin sendiri.
  "base-uri 'self'",

  // Paksa HTTP → HTTPS. TIDAK di dev (localhost http bisa breakout).
  isProd ? "upgrade-insecure-requests" : "",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Jangan bocorkan referrer lintas-origin secara penuh
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Anti MIME-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Batasi API browser — tidak butuh kamera/mic/geo di situs B2B briket
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HSTS — cegah downgrade https (hanya prod; https cert dibutuhkan)
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Terapkan ke semua route (file, API, halaman)
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;