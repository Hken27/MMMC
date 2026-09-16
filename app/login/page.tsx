import Link from "next/link";

export const metadata = {
  title: "Masuk — CMMM",
  description: "Login pembeli / mitra CMMM.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Masuk
      </h1>
      <p className="max-w-md text-center text-muted-foreground">
        Autentikasi dibangun di Fase 3 (session protection, httpOnly Secure
        SameSite=Strict).
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