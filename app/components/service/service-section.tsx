import { OrderRoadmap } from "./order-roadmap";
import { OrderTracking } from "./order-tracking";
import { Certifications } from "./certifications";
import { AffiliateFlags } from "./affiliate-flags";
import { Separator } from "@/components/ui/separator";

/**
 * ServiceSection — #service (single-page home section).
 * Terdiri dari: Order Roadmap + Order Tracking + Company Certifications.
 */
export function ServiceSection() {
  return (
    <section id="service" className="w-full scroll-mt-16 border-t border-border/40 bg-surface/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            LAYANAN KAMI
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ekspor <span className="text-accent">End-to-End</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Dari pendaftaran akun hingga pesanan sampai di tangan Anda — satu tim,
            satu tanggung jawab.
          </p>
        </div>

        {/* 1. Order Roadmap */}
        <OrderRoadmap />

        <Separator className="my-14 bg-border/40" />

        {/* 2. Order Tracking */}
        <OrderTracking />

        <Separator className="my-14 bg-border/40" />

        {/* 3. Company Certifications */}
        <Certifications />
      </div>
    </section>
  );
}