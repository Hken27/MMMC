"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { NavbarMobileMenu } from "./navbar-mobile-menu";

/**
 * NavbarClient — handle interaksi toggle hamburger + active states.
 * Seluruh markup link tetap SERVER-render (SEO), client ini hanya beri
 * agarJS layer: hamburger open/close, keyboard, aria.
 */
export function NavbarClient() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop language selector — hidden on mobile */}
      <div className="hidden items-center gap-2 md:flex">
        <div className="group relative">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span>EN</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark hover:shadow-md"
        >
          Masuk
        </a>
      </div>

      {/* Hamburger — MD ke bawah */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Mobile drawer — animated via Motion */}
      <AnimatePresence>
        {open && (
          <NavbarMobileMenu
            onClose={() => setOpen(false)}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </>
  );
}