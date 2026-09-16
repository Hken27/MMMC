import { LEGAL_LINKS } from "@/lib/contact";

/**
 * LegalFooter — baris footer dengan legal links + copyright.
 * "Single page website" → legal halaman link di footer, bukan rute terpisah.
 */
export function LegalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Legal links */}
        <nav
          aria-label="Legal links"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {LEGAL_LINKS.map((link) => (
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
          © {year} CMMM — Premium Wood Charcoal Briquettes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}