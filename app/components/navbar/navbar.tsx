import Link from "next/link";
import { NavbarClient } from "./navbar-client";

/**
 * Navbar — server component wrapper.
 * Single-page website: semua navigasi pakai anchor links (#section),
 * bukan route-based. NavbarClient handle IntersectionObserver untuk
 * active section + smooth scroll behavior.
 */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "#home" },
  { label: "Produk", href: "#produk" },
  { label: "Service", href: "#service" },
  { label: "Kontak", href: "#kontak" },
];

export function Navbar() {
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
      <NavbarClient />
    </nav>
  );
}