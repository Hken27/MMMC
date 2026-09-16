import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "./product-card";
import { ProductSpecs } from "./product-specs";
import { ProductOrder } from "./product-order";

/**
 * ProductSection — RSC wrapper untuk product grid.
 * Server-rendered heading + SEO metadata, client components
 * (ProductCard + ProductSpecs + ProductOrder) untuk animasi dan interaksi.
 */
export function ProductSection() {
  return (
    <section id="produk" className="w-full scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            KATALOG PRODUK
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Charcoal Briquettes <span className="text-accent">Unggulan</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Tiga varian premium yang siap ekspor: Shisha, BBQ, dan Quick
            Lighting. Kualitas konsisten, harga kompetitif, MOQ fleksibel.
          </p>
        </div>

        {/* Product grid — 1 kolom mobile, 2 tablet, 3 desktop */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard product={product} index={i} />
              <ProductSpecs product={product} />
            </div>
          ))}
        </div>

        {/* Order configurator — 1 kalkulator untuk semua kategori (selector kategori didalam) */}
        <div className="mx-auto mt-10 max-w-2xl">
          <ProductOrder products={PRODUCTS} />
        </div>
      </div>
    </section>
  );
}
