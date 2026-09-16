"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Flag, ChevronLeft, ChevronRight, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AffiliateFlags — carousel bendera 7 negara afiliasi CMMM.
 *
 * ARAH: BERLAWANAN dengan carousel Company Certifications.
 *   - Certifications (certifications.tsx)  → auto-scroll KANAN
 *   - AffiliateFlags (file ini)            → auto-scroll KIRI
 * Dua-duanya auto-scroll; berlawanan arah (seperti user revisi:
 * "flags negara bergerak berlawanan arah dari sertifikasi").
 *
 * Negara afiliasi (pasar ekspor / buyer international CMMM):
 *   🇸🇦 Arab Saudi · 🇩🇿 Aljazair · 🇮🇶 Irak · 🇮🇷 Iran ·
 *   🇺🇸 Amerika Serikat · 🇯🇵 Jepang · 🇰🇷 Korea Selatan.
 *
 * Rendering bendera pakai lucide `<Flag>` (SVG) — bukan emoji flag
 * (emoji flag tidak konsisten antar OS — tak tampil di Windows lama /
 * Linux, dan broken tanpa fallback). Arah carousel dimirror dengan
 * wrapper `[direction:rtl]` + `dir` pada children supaya push kiri
 * secara visual konsisten di semua arah penulisan.
 */

const AFFILIATE_COUNTRIES = [
  { name: "Arab Saudi", code: "SA" },
  { name: "Aljazair", code: "DZ" },
  { name: "Irak", code: "IQ" },
  { name: "Iran", code: "IR" },
  { name: "Amerika Serikat", code: "US" },
  { name: "Jepang", code: "JP" },
  { name: "Korea Selatan", code: "KR" },
];

export function AffiliateFlags() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(trueBahasa);

  function updateEdgeStates() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  const scrollByDir = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    if (dir === 1) {
      // Arah carousel ini: KIRI (scroll ke kiri)
      el.scrollBy({ left: -el.clientWidth * 0.6, behavior: "smooth" });
    } else {
      el.scrollBy({ left: el.clientWidth * 0.6, behavior: "smooth" });
    }
    updateEdgeEstates();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (el) {
      el.addEventListener("scroll", updateEdgeStates, { passive: true });
      updateEdgeStates();
    }
    const timer = window.setInterval(() => {
      const node = trackRef.current;
      if (!node) return;
      // Auto-scroll KIRI (berlawanan dengan certifications yang KANAN).
      if (node.scrollLeft <= 0) {
        node.scrollBy({ left: node.clientWidth * 0.55, behavior: "smooth" });
      } else {
        node.scrollBy({ left: -node.clientWidth * 0.55, behavior: "smooth" });
      }
    }, 3200);
    return () => {
      el?.removeEventListener("scroll", updateEdgeStates);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="mt-14" aria-label="Negara afiliasi CMMM">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Globe2 className="h-4 w-4 text-accent" aria-hidden="true" />
            Negara <span className="text-accent">Afiliasi</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            7 negara buyer aktif &amp; afiliasi ekspor kami
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={!canNext}
            aria-label="Geser negara ke kanan"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={!canPrev}
            aria-label="Geser negara ke kiri"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Track — arah carousel: auto → KIRI (berlawanan: certs → KANAN) */}
      <div
        ref={trackRef}
        className="carousel-track flex gap-3 overflow-x-auto scroll-smooth pb-1 [direction:rtl]"
      >
        {AFFILIATE_COUNTRIES.map((c) => (
          <div
            key={c.code}
            className="flex min-w-[150px] flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-surface/60 px-4 py-3"
          >
            <Flag className="h-8 w-8 text-accent/80" aria-hidden="true" />
            <span className="text-xs font-medium text-foreground/80">{c.name}</span>
            <span className="text-[10px] text-muted-foreground/70">{c.code}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
