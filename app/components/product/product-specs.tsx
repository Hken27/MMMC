"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Package,
  Truck,
  FileText,
  Scale,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

/**
 * ProductSpecs — expandable detail spesifikasi produk.
 * Berisi 3 tab: MOQ, Packaging, Delivery.
 * Setiap tab di-klik expand/collapse dengan animasi slide.
 */
export function ProductSpecs({ product }: { product: Product }) {
  const [openTab, setOpenTab] = useState<string | null>(null);

  const toggle = (tab: string) =>
    setOpenTab((prev) => (prev === tab ? null : tab));

  return (
    <div className="mt-3 space-y-1">
      <SpecToggle
        label="MOQ (Minimum Order Quantity)"
        icon={<Scale className="h-4 w-4" />}
        isOpen={openTab === "moq"}
        onToggle={() => toggle("moq")}
      >
        <ul className="space-y-1.5">
          {product.moq.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </SpecToggle>

      <SpecToggle
        label="Packaging"
        icon={<Package className="h-4 w-4" />}
        isOpen={openTab === "packaging"}
        onToggle={() => toggle("packaging")}
      >
        <div className="space-y-3">
          <PackagingGroup
            title="Master Box"
            items={product.packaging.masterBox.map((w) => `${w} kg`)}
          />
          <PackagingGroup
            title="Mini Box"
            items={product.packaging.miniBox.map((w) =>
              w >= 1000 ? `${w / 1000} kg` : `${w} gram`
            )}
          />
          <PackagingGroup
            title="Special Box"
            items={product.packaging.specialBox.map((w) =>
              w >= 1000 ? `${w / 1000} ton` : `${w} kg`
            )}
          />
        </div>
      </SpecToggle>

      <SpecToggle
        label="Delivery & Dokumen"
        icon={<Truck className="h-4 w-4" />}
        isOpen={openTab === "delivery"}
        onToggle={() => toggle("delivery")}
      >
        <div className="space-y-4">
          {/* Domestic */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Domestik
            </p>
            <div className="flex flex-wrap gap-2">
              {product.delivery.domestic.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/70">
              * Ongkir mandiri atau tagihan menyeluruh
            </p>
          </div>

          {/* International */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Luar Negeri
            </p>
            <div className="flex flex-wrap gap-2">
              {product.delivery.international.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Legal docs */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/60">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Dokumen Legalitas
            </p>
            <div className="flex flex-wrap gap-2">
              {product.delivery.docs.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  {doc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SpecToggle>
    </div>
  );
}

/** SpecToggle — tombol expand/collapse dengan animasi content. */
function SpecToggle({
  label,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40 bg-surface/50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
          isOpen
            ? "text-accent"
            : "text-foreground/70 hover:text-foreground hover:bg-surface-hover"
        )}
      >
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 px-3 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** PackagingGroup — grup ukuran packaging. */
function PackagingGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-foreground/60">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded bg-surface-hover px-2 py-0.5 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
