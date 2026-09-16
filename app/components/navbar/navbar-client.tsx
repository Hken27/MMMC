"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { NavbarMobileMenu } from "./navbar-mobile-menu";
import { DesktopNavLinks } from "./desktop-nav-links";

/**
 * NavbarClient — layer interaktif navbar (single-page website).
 * IntersectionObserver lacak section aktif berdasarkan ID (#home, #produk, etc),
 * smooth scroll via anchor href. Tidak ada usePathname — semua di `/` page.
 */
export function NavbarClient() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  const close = useCallback(() => setOpen(false), []);

  // IntersectionObserver: lacak section mana yang terlihat di viewport
  useEffect(() => {
    const sectionIds = ["home", "produk", "service", "kontak"];
    const observers: IntersectionObserver[] = [];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(`#${id}`);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // isActive: anchor match
  const isActive = useCallback(
    (href: string) => activeSection === href,
    [activeSection]
  );

  // Scroll lock body saat drawer terbuka + ESC untuk menutup.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Desktop links + actions — hidden di md ke bawah */}
      <div className="hidden items-center gap-4 md:flex">
        <DesktopNavLinks isActive={isActive} />
        <div className="hidden items-center gap-2 lg:flex">
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
      </div>

      {/* Hamburger toggle — hanya di mobile */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Mobile drawer — animasi Motion, dimount via AnimatePresence */}
      <AnimatePresence>
        {open && <NavbarMobileMenu onClose={close} isActive={isActive} />}
      </AnimatePresence>
    </>
  );
}
