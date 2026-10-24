"use client";

import { motion } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import { LanguageSwitch } from "../ui/language-switch";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import type { NavLink } from "./navbar";

/**
 * NavbarMobileMenu — drawer slide-in kanan untuk layar < md.
 * Motion layout animated + aria-management (role=dialog, focus trap light).
 * Dipanggil dalam <AnimatePresence> oleh parent (unmount on close).
 * Session-aware: menampilkan profile/logout ketika authenticated.
 */
export function NavbarMobileMenu({
  navLinks,
  onClose,
  isActive,
}: {
  navLinks: NavLink[];
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const { data: session } = useSession();
  return (
    <>
      {/* Overlay — klik area luar menutup, aria-hidden */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slide dari kanan */}
      <motion.div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        className="fixed right-0 top-0 z-50 flex h-svh w-72 max-w-[85vw] flex-col gap-4 border-l border-border bg-background p-6 shadow-xl md:hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 34 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            <span className="text-accent">C</span>MMM
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <span className="sr-only">Tutup</span>✕
          </button>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Menu navigasi mobile">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-surface-hover text-accent"
                  : "text-foreground/70 hover:text-foreground hover:bg-surface-hover"
              }`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <LanguageSwitch />
          {session ? (
            <>
              <div className="px-3 py-2 rounded-md bg-surface/50">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-accent" />
                  <p className="text-xs text-muted-foreground">Logged in as</p>
                </div>
                <p className="text-xs font-medium text-foreground truncate">{session?.user?.username || session?.user?.email || 'User'}</p>
              </div>
              {session.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-md bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors"
                >
                  Dashboard Admin
                </Link>
              )}
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              Masuk
            </a>
          )}
        </div>
      </motion.div>
    </>
  );
}