import Link from "next/link";
import { useTranslations } from "next-intl";
import { NavbarClient } from "./navbar-client";

/**
 * Navbar — server component wrapper.
 * Single-page website: semua navigasi pakai anchor links (#section),
 * bukan route-based. NavbarClient handle IntersectionObserver untuk
 * active section + smooth scroll behavior.
 * Label nav di-i18n via useTranslations (id/en).
 */
export type NavLink = { label: string; href: string };

export function Navbar() {
  const t = useTranslations("Nav");

  const navLinks: NavLink[] = [
    { label: t("home"), href: "#home" },
    { label: t("products"), href: "#produk" },
    { label: t("service"), href: "#service" },
    { label: t("contact"), href: "#kontak" },
  ];

  return (
    <nav
      className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      aria-label="Navigasi utama"
    >
      {/* Brand — logo teks CMMM */}
      <Link
        href="/"
        className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
      >
        <span className="text-accent">C</span>MMM
      </Link>

      {/* Links (tengah) + actions (kanan) — client component */}
      <NavbarClient navLinks={navLinks} />
    </nav>
  );
}