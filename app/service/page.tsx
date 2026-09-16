import Link from "next/link";

export const metadata = {
  title: "Service — CMMM",
  description:
    "Layanan ekspor charcoal briquettes: pengemasan, verifikasi kualitas, logistik internasional.",
};

export default function ServicePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Service
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Halaman layanan. Rincian layanan ekspor akan diisi di fase berikutnya.
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