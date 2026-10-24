import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductSection } from "./components/product/product-section";
import { ServiceSection } from "./components/service/service-section";
import { InquirySection } from "./components/inquiry/inquiry-section";
import { LegalFooter } from "./components/footer/legal-footer";

export const metadata = {
  title: "CMMM — Premium Wood Charcoal Briquettes Exporter",
  description:
    "Premium quality wood charcoal briquettes for international B2B buyers. Sustainable, high-efficiency, and export-ready from Indonesia.",
};

/**
 * Home — single-page website.
 * Semua section dalam satu halaman, scrollable vertikal:
 * #home → #produk → #service → #kontak + legal footer.
 */
export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero — #home */}
      <section
        id="home"
        className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center scroll-mt-16"
      >
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t("Hero.badge")}
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {t("Hero.titlePrefix")}{" "}
          <span className="text-accent">{t("Hero.titleAccent")}</span>{" "}
          {t("Hero.titleSuffix")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("Hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#produk"
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-dark hover:shadow-md"
          >
            {t("Hero.ctaProducts")}
          </Link>
          <Link
            href="#kontak"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
          >
            {t("Hero.ctaContact")}
          </Link>
        </div>
      </section>

      {/* Produk */}
      <ProductSection />

      {/* Service */}
      <ServiceSection />

      {/* Kontak */}
      <InquirySection />

      {/* Footer */}
      <LegalFooter />
    </div>
  );
}