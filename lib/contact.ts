/**
 * Data kontak CMMM — single source of truth untuk halaman kontak.
 * Termasuk: jam operasional, kanal kontak, QR WeChat, media sosial, legal links.
 */

export const OPERATIONAL_HOURS = [
  {
    days: "Senin – Jumat",
    hours: "09.00 – 16.00 WIB",
    icon: "clock",
  },
  {
    days: "Sabtu – Minggu",
    hours: "08.00 – 13.00 WIB",
    icon: "calendar",
  },
] as const;

export const CONTACT_CHANNELS = [
  {
    id: "email",
    label: "Email",
    value: "sales@cmmm.co.id",
    href: "mailto:sales@cmmm.co.id",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    id: "office",
    label: "Head Office",
    value: "Pasuruan, Jawa Timur, Indonesia",
    href: "https://maps.google.com/?q=Pasuruan",
  },
  ] as const;

/** Media sosial — href harus link nyata ke profil masing-masing. */
export const SOCIAL_MEDIA = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/",
  },
] as const;

/** Legal links — 7 halaman kebijakan. */
export const LEGAL_LINKS = [
  { label: "Term Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms and Condition", href: "/legal/terms-conditions" },
  { label: "Return and Refund", href: "/legal/refund" },
  { label: "Sample and Logistic", href: "/legal/sample-logistic" },
  { label: "Shipping", href: "/legal/shipping" },
  { label: "Payment", href: "/legal/payment" },
] as const;

/** QR codes — asset asli dari components/assets/. */
export const QR_ASSETS = [
  { id: "wechat", label: "WeChat", src: "/images/wc.jpeg" },
  { id: "line", label: "Line", src: "/images/ln.jpeg" },
] as const;

/** Copyright tahun berjalan. */
export const COPYRIGHT =
  "© 2026 CMMM — Premium Wood Charcoal Briquettes. All rights reserved.";