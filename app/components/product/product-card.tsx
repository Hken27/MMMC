"use client";

import { motion } from "motion/react";
import { Heart, ShoppingCart, Flame, Clock, Droplets, Wind } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/products";
import { formatRupiah } from "@/lib/products";
import { ProductVisual } from "./product-visual";

/** Map product id → visual variant. */
function visualVariant(id: string): "shisha" | "bbq" | "quick" {
  if (id === "shisha") return "shisha";
  if (id === "bbq") return "bbq";
  return "quick";
}

/** Map product id → i18n key. */
function i18nKey(id: string): "shisha" | "bbq" | "quick" {
  if (id === "shisha") return "shisha";
  if (id === "bbq") return "bbq";
  return "quick";
}

/**
 * ProductCard — kartu produk utama dengan animasi viewport.
 * Nama, deskripsi, spesifikasi & use-case DIVERJEMAHKAN via next-intl.
 */
export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const t = useTranslations("Product");
  const key = i18nKey(product.id);

  const name = t(`${key}.name`);
  const description = t(`${key}.description`);
  const useCase = t(`${key}.useCase`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        delay: 0.1 * index,
      }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
        {/* Accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-accent to-accent-dark" />
        <ProductVisual
          variant={visualVariant(product.id)}
          className="h-44 w-full shrink-0 object-cover"
        />

        <CardHeader className="pt-4">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant="secondary"
              className="w-fit bg-accent/10 text-accent hover:bg-accent/20"
            >
              <Flame className="mr-1 h-3 w-3" aria-hidden="true" />
              {key === "shisha" ? "Shisha" : key === "bbq" ? "BBQ" : "Quick Light"}
            </Badge>
            <span className="text-right text-sm font-semibold text-accent">
              {formatRupiah(product.pricePerKg)}
              <span className="block text-xs font-normal text-muted-foreground">
                /kg
              </span>
            </span>
          </div>
          <CardTitle className="mt-2 text-lg font-semibold text-foreground">
            {name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <SpecItem icon={<Droplets className="h-3.5 w-3.5" />} label={t("specTitles.ashContent")} value={t(`specValues.${key}.ashContent`)} />
            <SpecItem icon={<Clock className="h-3.5 w-3.5" />} label={t("specTitles.burningTime")} value={t(`specValues.${key}.burningTime`)} />
            <SpecItem icon={<Wind className="h-3.5 w-3.5" />} label={t("specTitles.smoke")} value={t(`specValues.${key}.smoke`)} />
            <SpecItem icon={<Flame className="h-3.5 w-3.5" />} label={t("specTitles.color")} value={t(`specValues.${key}.color`)} />
          </div>

          {/* Use case */}
          <Separator className="bg-border/50" />

          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{t("useCaseLabel")}</span>{" "}
            {useCase}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-6 py-3">
          {/* Likes / buyer orders */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
            aria-label={`${product.likes} ${t("orders")}`}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>{product.likes}</span>
          </button>

          {/* Inquiry link */}
          <a
            href="#kontak"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            aria-label={`${t("inquiry")} ${name}`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>{t("inquiry")}</span>
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/** SpecItem — baris spesifikasi kecil dengan ikon + label + value. */
function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-surface px-2 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground/80">{value}</span>
    </div>
  );
}
