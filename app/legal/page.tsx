import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/contact";

export const metadata = {
  title: "Legal & Kebijakan — CMMM",
  description:
    "Kebijakan layanan CMMM: Term Service, Privacy Policy, Terms and Condition, Return and Refund, Sample and Logistic, Shipping, dan Payment.",
};

/**
 * LegalPage — daftar semua kebijakan legal CMMM.
 * Setiap link dari halaman kontak → section di halaman ini (single-page style).
 */
export default function LegalPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="w-full py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            LEGAL
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Legal & <span className="text-accent">Kebijakan</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Dokumen kebijakan layanan, privasi, pengiriman, dan pembayaran CMMM
            untuk transaksi B2B internasional yang aman dan transparan.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {LEGAL_LINKS.map((l, i) => (
              <div
                key={l.href}
                className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-accent/40"
              >
                <span className="text-xs font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-1 text-base font-semibold text-foreground">
                  {l.label}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Section kebijakan {l.label}. Detail konten akan diisi pada
                  penyempurnaan dokumen legal.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/kontak"
              className="inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Kembali ke Kontak
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}