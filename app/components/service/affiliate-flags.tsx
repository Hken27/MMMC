"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Globe2 } from "lucide-react";

/**
 * AffiliateFlags — auto-scroll marquee (seamless loop, tanpa buttons).
 * Arah: KIRI (berlawanan dengan Certifications yang KANAN).
 * Pure animation-based carousel menggunakan `transform: translate3d`.
 * Bendera negara: flagcdn.com SVG (Opsi B - REST API).
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

const CARD_WIDTH = 170; // px (incl gap)

export function AffiliateFlags() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Setup: duplikasi cards untuk seamless loop
    const cards = track.querySelectorAll(".flag-card");
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.appendChild(clone);
    });

    // Prefersnya reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // Jangan animasi kalau user prefer reduce

    let position = 0;
    const speed = 25; // pixels per second (sedikit lebih lambat dari certs)
    let lastTime = Date.now();
    let animId: number;

    function animate() {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Gerak KIRI (negative direction)
      position -= speed * delta;

      // Reset ke awal saat halfway (seamless loop)
      if (position <= -CARD_WIDTH * AFFILIATE_COUNTRIES.length) {
        position = 0;
      }

      if (track) {
        track.style.transform = `translate3d(${position}px, 0, 0)`;
      }
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="mt-14" aria-label="Negara afiliasi CMMM">
      {/* Header */}
      <div className="mb-5 text-center">
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <Globe2 className="h-4 w-4 text-accent" aria-hidden="true" />
          Negara <span className="text-accent">Afiliasi</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          7 negara buyer aktif &amp; afiliasi ekspor kami
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3"
          style={{
            width: "fit-content",
            willChange: "transform",
          }}
        >
          {AFFILIATE_COUNTRIES.map((c) => (
            <div key={c.code} className="flag-card" style={{ width: CARD_WIDTH - 12 }}>
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-surface/60 px-4 py-3">
                <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                    alt={`Bendera ${c.name}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback ke emoji jika gagal load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement("div");
                        fallback.className = "flex h-full w-full items-center justify-center text-2xl";
                        fallback.textContent = "🌐";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground/80">{c.name}</span>
                <span className="text-[10px] text-muted-foreground/70">{c.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
