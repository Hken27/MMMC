import { Mail, Phone, MapPin, Clock, Calendar } from "lucide-react";
import { InquiryForm } from "./inquiry-form";
import {
  OPERATIONAL_HOURS,
  SOCIAL_MEDIA,
  QR_ASSETS,
} from "@/lib/contact";

/**
 * InquirySection — layout kontak: info kontak + QR + jam operasional + sosmed
 * di kiri, form inquiry di kanan. RSC wrapper untuk SEO.
 */
export function InquirySection() {
  return (
    <section id="kontak" className="w-full scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          {/* ===== LEFT: contact info ===== */}
          <div className="space-y-8">
            {/* Heading */}
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                KONTAK KAMI
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Kirim <span className="text-accent">Inquiry</span> Anda
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Butuh volume besar, packaging spesial, atau target negara tertentu?
                Ceritakan kebutuhan Anda, tim kami siap membantu.
              </p>
            </div>

            {/* Contact channels */}
            <div className="grid gap-3 sm:grid-cols-2">
              <ChannelCard
                icon={<MapPin className="h-5 w-5" />}
                title="Head Office"
                value="Pasuruan, Jawa Timur, Indonesia"
              />
              <ChannelCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                value="sales@cmmm.co.id"
                href="mailto:sales@cmmm.co.id"
              />
              <ChannelCard
                icon={<Phone className="h-5 w-5" />}
                title="WhatsApp"
                value="+62 812-3456-7890"
                href="https://wa.me/6281234567890"
              />
            </div>

            {/* QR scan — WeChat & Line (asset asli dari components/assets/) */}
            <div className="grid grid-cols-2 gap-3">
              {QR_ASSETS.map((qr) => (
                <div
                  key={qr.id}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qr.src}
                    alt={`QR Code ${qr.label} CMMM`}
                    className="h-28 w-28 rounded-lg bg-white object-contain p-1.5"
                    width={112}
                    height={112}
                  />
                  <p className="text-center text-xs text-muted-foreground">
                    Scan via <span className="font-medium text-accent">{qr.label}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Operational hours */}
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
                Jam Operasional
              </h3>
              <div className="space-y-3">
                {OPERATIONAL_HOURS.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-center justify-between border-b border-border/40 pb-2 text-sm last:border-0 last:pb-0"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {h.days}
                    </span>
                    <span className="font-medium text-foreground">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social media */}
            <div className="flex flex-wrap gap-2">
              {SOCIAL_MEDIA.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-surface px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
                  aria-label={`${s.label} CMMM`}
                >
                  <SocialIcon id={s.id} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: inquiry form ===== */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-lg sm:p-8 lg:sticky lg:top-24 lg:self-start">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/** ChannelCard — kartu kanal kontak. */
function ChannelCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-accent/40"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4">
      {inner}
    </div>
  );
}

/** SocialIcon — icon lucide untuk tiap media sosial. */
/** SocialIcon — inline SVG brand icons (lucide-react tidak punya brand icons). */
function SocialIcon({ id }: { id: string }) {
  const cls = "h-4 w-4";
  switch (id) {
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.81A3.02 3.02 0 0 0 2.62 20c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      );
    default:
      return null;
  }
}

