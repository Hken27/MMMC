"use client";

import { motion } from "motion/react";
import { Heart, ShoppingCart, Flame, Clock, Droplets, Wind } from "lucide-react";
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

/**
 * ProductCard — kartu produk utama dengan animasi viewport.
 * Menampilkan: badge kategori, nama, deskripsi, spesifikasi singkat,
 * harga per kg, dan 2 ikon aksi (likes + inquiry).
 */
export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
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
              {product.name.includes("Shisha")
                ? "Shisha"
                : product.name.includes("BBQ")
                  ? "BBQ"
                  : "Quick Light"}
            </Badge>
            <span className="text-right text-sm font-semibold text-accent">
              {formatRupiah(product.pricePerKg)}
              <span className="block text-xs font-normal text-muted-foreground">
                /kg
              </span>
            </span>
          </div>
          <CardTitle className="mt-2 text-lg font-semibold text-foreground">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <SpecItem icon={<Droplets className="h-3.5 w-3.5" />} label="Ash" value={product.specs.ashContent} />
            <SpecItem icon={<Clock className="h-3.5 w-3.5" />} label="Burning" value={product.specs.burningTime} />
            <SpecItem icon={<Wind className="h-3.5 w-3.5" />} label="Smoke" value={product.specs.smoke} />
            <SpecItem icon={<Flame className="h-3.5 w-3.5" />} label="Warna" value={product.specs.color} />
          </div>

          {/* Dynamic extras */}
          {product.specs.extras && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(product.specs.extras).map(([key, val]) => (
                <Badge
                  key={key}
                  variant="outline"
                  className="border-border/60 text-xs text-muted-foreground"
                >
                  {key}: {val}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Use case */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Kegunaan:</span>{" "}
            {product.useCase}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-6 py-3">
          {/* Likes / buyer orders */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
            aria-label={`${product.likes} buyer orders`}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>{product.likes}</span>
          </button>

          {/* Inquiry link */}
          <a
            href="#kontak"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            aria-label={`Inquiry ${product.name}`}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            <span>Inquiry</span>
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
