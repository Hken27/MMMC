import { useTranslations } from "next-intl";

/**
 * LegalFooter — baris footer dengan legal links + copyright.
 * Label & copyright i18n via next-intl.
 */
export function LegalFooter() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  const legalLinks = [
    { href: "/legal/terms", label: t("legalLinks.terms") },
    { href: "/legal/privacy", label: t("legalLinks.privacy") },
    { href: "/legal/terms-conditions", label: t("legalLinks.termsConditions") },
    { href: "/legal/refund", label: t("legalLinks.refund") },
    { href: "/legal/sample-logistic", label: t("legalLinks.sampleLogistic") },
    { href: "/legal/shipping", label: t("legalLinks.shipping") },
    { href: "/legal/payment", label: t("legalLinks.payment") },
  ];

  return (
    <footer className="border-t border-border/50 bg-background/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Legal links */}
        <nav
          aria-label="Legal links"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-auto my-4 h-px max-w-md bg-border/50" />

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground/80">
          {t("copyright", { year })}
        </p>
      </div>
    </footer>
  );
}