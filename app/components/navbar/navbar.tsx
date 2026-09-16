import Link from "next/link";
import { NavbarClient } from "./navbar-client";

/**
 * Navbar — RSC wrapper (server component).
 * Nav config hidup di sini; interaksi (hamburger, dropdown)
 * dipindah ke client component di bawah.
 *
 * Strategic: default server-render = SEO-friendly (SSR crawler
 * melihat semua link), progressive enhancement untuk interaksi.
 */
export type NavLink = { label: string; href: string; active?: boolean };

export const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/", active: true },
  { label: "Produk", href: "/produk" },
  { label: "Service", href: "/service" },
  { label: "Kontak", href: "/kontak" },
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

      {/* Desktop links — inline markup, RSC */}
      <div className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              link.active
                ? "text-accent"
                : "text-foreground/70 hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right actions — desktop + mobile share */}
      <div className="hidden items-center gap-2 md:flex">
        <a
          href="#language"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:bg-surface-hover"
        >
          <GlobeIcon className="h-4 w-4" aria-hidden="true" />
          <span>EN</span>
        </a>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark"
        >
          Masuk
        </a>
      </div>

      {/* Mobile hamburger — client component */}
      <NavbarClient />
    </nav>
  );
}

/** Inline icon (zero-dep) — diganti Lucide saat deps dibersihkan. */
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}