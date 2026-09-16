import Link from "next/link";

export const metadata = {
  title: "Kontak — CMMM",
  description:
    "Hubungi tim CMMM untuk inquiry pembelian charcoal briquettes secara internasional.",
};

export default function KontakPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Kontak
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Halaman kontak + form inquiry dibangun di Fase 2.
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