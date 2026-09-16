"use client";

import { useRef } from "react";
import { FileText, ExternalLink, Award, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Certifications — carousel card sertifikasi perusahaan + badge standar.
 * Horizontal scroll container dengan tombol prev/next (native scroll-behavior smooth).
 * ISO.pdf asli dari assets/doc (disalin ke public/documents/).
 * Klik → open new tab aman.
 */

type Cert = {
  id: string;
  name: string;
  description: string;
  href: string;
  hasFile: boolean; // true = ada file asli, false = badge standar
  icon: "iso" | "msds" | "coo" | "fumigasi";
};

const CERTS: Cert[] = [
  {
    id: "iso",
    name: "ISO 9001:2015",
    description: "Sistem manajemen mutu internasional untuk produk arang briket.",
    href: "/documents/ISO.pdf",
    hasFile: true,
    icon: "iso",
  },
  {
    id: "msds",
    name: "MSDS",
    description: "Material Safety Data Sheet — keamanan material produk untuk ekspor.",
    href: "#",
    hasFile: false,
    icon: "msds",
  },
  {
    id: "coo",
    name: "COO / SKA",
    description: "Certificate of Origin — surat keterangan asal produk Indonesia.",
    href: "#",
    hasFile: false,
    icon: "coo",
  },
  {
    id: "fumigasi",
    name: "Fumigasi",
    description: "Sertifikat fumigasi pengemasan kayu untuk standar internasional.",
    href: "#",
    hasFile: false,
    icon: "fumigasi",
  },
];

/** Lebar kartu — visibel sebagian (margin) agar jelas carousel-nya. */
const CARD_WIDTH = 260;

export function Certifications() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * CARD_WIDTH * 1.5, behavior: "smooth" });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          SERTIFIKASI
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Company <span className="text-accent">Certifications</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Standar kualitas dan legalitas yang kami pegang untuk ekspor internasional.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Track — horizontal scroll snap */}
        <div
          ref={trackRef}
          className="carousel-track flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
        >
          {CERTS.map((cert) => (
            <div key={cert.id} className="snap-start" style={{ width: CARD_WIDTH }}>
              <CertCard cert={cert} />
            </div>
          ))}
        </div>

        {/* Nav arrows — hidden */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Sertifikasi sebelumnya"
          className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground/70 shadow-sm transition-colors hover:border-accent/40 hover:text-accent sm:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Sertifikasi berikutnya"
          className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground/70 shadow-sm transition-colors hover:border-accent/40 hover:text-accent sm:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Hint swipe mobile */}
      <p className="mt-3 text-center text-xs text-muted-foreground/60 sm:hidden">
        Geser ke samping untuk melihat semua sertifikasi
      </p>
    </div>
  );
}

function CertCard({ cert }: { cert: Cert }) {
  const isAvailable = cert.hasFile;

  return (
    <a
      href={cert.href}
      target="_blank"
      rel={isAvailable ? "noopener noreferrer" : undefined}
      className={`group flex h-full flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 text-center transition-all ${
        isAvailable
          ? "cursor-pointer hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
          : "cursor-default opacity-70"
      }`}
      aria-label={`${cert.name} — ${isAvailable ? "buka dokumen" : "tersedia di fase berikutnya"}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
        <CertIcon icon={cert.icon} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{cert.name}</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cert.description}</p>
      </div>
      {isAvailable && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Lihat Dokumen
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
      {!isAvailable && (
        <span className="text-xs text-muted-foreground/60">Tersedia di fase berikutnya</span>
      )}
    </a>
  );
}

function CertIcon({ icon }: { icon: Cert["icon"] }) {
  switch (icon) {
    case "iso":
      return <Award className="h-7 w-7" aria-hidden="true" />;
    case "msds":
      return <ShieldCheck className="h-7 w-7" aria-hidden="true" />;
    case "coo":
      return <FileText className="h-7 w-7" aria-hidden="true" />;
    case "fumigasi":
      return <ShieldCheck className="h-7 w-7" aria-hidden="true" />;
  }
}