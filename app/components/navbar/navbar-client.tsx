"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NavbarMobileMenu } from "./navbar-mobile-menu";
import { DesktopNavLinks } from "./desktop-nav-links";
import { LanguageSwitch } from "../ui/language-switch";
import type { NavLink } from "./navbar";

/**
 * NavbarClient — layer interaktif navbar (single-page website).
 * Animasi smooth pada initial load + interactive states.
 * navLinks di-pass dari server component (i18n already-resolved).
 */
export function NavbarClient({ navLinks }: { navLinks: NavLink[] }) {
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
      <motion.div
        className="hidden items-center gap-6 md:flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <DesktopNavLinks navLinks={navLinks} isActive={isActive} />
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language switch — dropdown bahasa */}
          <LanguageSwitch />

          {/* Login Button */}
          <motion.a
            href="/login"
            className="group relative inline-flex items-center justify-center rounded-md bg-gradient-to-r from-accent to-accent/80 px-6 py-2.5 text-sm font-semibold text-white shadow-sm overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <span className="relative">
              Masuk
            </span>
          </motion.a>
        </div>
      </motion.div>

      {/* Hamburger toggle — hanya di mobile */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-all duration-200 hover:bg-surface-hover hover:text-foreground md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Mobile drawer — animasi Motion, dimount via AnimatePresence */}
      <AnimatePresence>
        {open && <NavbarMobileMenu navLinks={navLinks} onClose={close} isActive={isActive} />}
      </AnimatePresence>
    </>
  );
}
