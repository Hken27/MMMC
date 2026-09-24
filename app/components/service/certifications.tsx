"use client";

import { FileText, ExternalLink, Award, ShieldCheck } from "lucide-react";

/**
 * Certifications — static grid layout (tanpa carousel).
 * Menampilkan seluruh sertifikasi dalam grid responsif.
 */

type Cert = {
  id: string;
  name: string;
  description: string;
  href: string;
  hasFile: boolean;
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
    href: "/documents/MSDS.pdf",
    hasFile: true,
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

export function Certifications() {
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

      {/* Static grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CERTS.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </div>
  );
}

function CertCard({ cert }: { cert: Cert }) {
  const isAvailable = cert.hasFile;

  return (
    <a
      href={cert.href}
      target={isAvailable ? "_blank" : undefined}
      rel={isAvailable ? "noopener noreferrer" : undefined}
      onClick={(e) => !isAvailable && e.preventDefault()}
      className={`group pointer-events-auto flex h-full flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 text-center transition-all ${
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