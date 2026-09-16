import Link from "next/link";

export const metadata = {
  title: "Produk — CMMM",
  description:
    "Katalog charcoal briquettes berkualitas premium untuk ekspor: coconut shell, wood charcoal, dan varian premium.",
};

export default function ProdukPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Produk
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Halaman katalog produk. Konten lengkap dibangun di Fase 2 (Product specs
        grid + Inquiry form).
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        ← Kembali ke Beranda
      </Link>
    </div>
  );
}