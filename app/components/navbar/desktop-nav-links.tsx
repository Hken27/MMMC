"use client";

import type { NavLink } from "./navbar";

/**
 * DesktopNavLinks — baris link navigasi untuk layar ≥ md.
 * Dipanggil dari NavbarClient (parent sudah punya container md:flex).
 * Active state di-drive oleh isActive dari parent agar state tunggal.
 */
export function DesktopNavLinks({
  navLinks,
  isActive,
}: {
  navLinks: NavLink[];
  isActive: (href: string) => boolean;
}) {
  return (
    <>
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "text-accent"
                : "text-foreground/70 hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
}