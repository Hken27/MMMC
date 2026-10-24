"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { setLocaleCookie, LOCALES, type Locale } from "../../../src/i18n/navigation";

/**
 * LanguageSwitch — dropdown "Choose language".
 *
 * Menampilkan daftar bahasa yang tersedia (Phase 4: Indonesia & English),
 * masing-masing dengan ikon bendera negara. Klik → set cookie NEXT_LOCALE
 * dan reload seluruh halaman agar SEMUA konten berganti bahasa.
 *
 * Arsitektur tanpa prefix URL → anchor single-page (#home/#produk) aman.
 */

type LanguageOption = {
  code: Locale;
  label: string; // nama bahasa versi lokal
  nativeName: string;
  country: string; // nama negara (untuk sort abjad)
  flag: React.ReactNode;
};

/** Bendera SVG inline (zero-dep, Phase 4 — Indonesia & English) */
function Flag({ locale }: { locale: Locale }) {
  const cls = "h-3.5 w-5 shrink-0 rounded-[2px] shadow-sm overflow-hidden";
  if (locale === "id") {
    return (
      <svg className={cls} viewBox="0 0 24 16" aria-hidden="true">
        <rect width="24" height="8" fill="#CE1126" />
        <rect y="8" width="24" height="8" fill="#FFFFFF" />
      </svg>
    );
  }
  // English — Union Jack
  return (
    <svg className={cls} viewBox="0 0 24 16" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="0.8" />
      <path d="M0 8H24M12 0V16" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M0 8H24M12 0V16" stroke="#C8102E" strokeWidth="1.2" />
    </svg>
  );
}

const RAW_OPTIONS: Omit<LanguageOption, "flag">[] = [
  { code: "id", label: "Indonesia", nativeName: "Bahasa Indonesia", country: "Indonesia" },
  { code: "en", label: "English", nativeName: "English", country: "United Kingdom" },
];

/** Urut abjad berdasarkan nama negara (A–Z). */
const OPTIONS: LanguageOption[] = RAW_OPTIONS.map((o) => ({
  ...o,
  flag: <Flag locale={o.code} />,
})).sort((a, b) => a.country.localeCompare(b.country));

export function LanguageSwitch() {
  const activeLocale = useLocale();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Locale>(activeLocale as Locale);
  const [, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sinkron jika locale berubah dari luar
  useEffect(() => setCurrent(activeLocale as Locale), [activeLocale]);

  // Tutup dropdown saat klik area luar / Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const switchTo = useCallback(
    (code: Locale) => {
      if (code === current) {
        setOpen(false);
        return;
      }
      setOpen(false);
      startTransition(() => setLocaleCookie(code));
    },
    [current]
  );

  const active = OPTIONS.find((o) => o.code === current) ?? OPTIONS[0];

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/70 px-3 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur transition-all duration-200 hover:border-accent/40 hover:bg-accent/5"
      >
        <Languages className="h-4 w-4 text-accent" aria-hidden="true" />
        {active.flag}
        <span>{active.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown — scroll: tampilkan ~3 bahasa teratas, sisanya scroll */}
      {open && (
        <div
          role="listbox"
          aria-label="Pilih bahasa"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-xl shadow-black/10"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Choose language
          </p>
          <div className="max-h-[11.5rem] overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          {OPTIONS.map((opt) => {
            const isActive = opt.code === current;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => switchTo(opt.code)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-foreground/85 hover:bg-accent/5 hover:text-foreground"
                }`}
              >
                {opt.flag}
                <span className="flex flex-col leading-tight">
                  <span>{opt.label}</span>
                  <span className="text-[11px] text-muted-foreground">{opt.nativeName}</span>
                </span>
                {isActive && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
              </button>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}