"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "@/lib/products";

/**
 * InquiryForm — form kontak B2B dengan honeypot anti-spam.
 *
 * Security:
 * - Honeypot field tersembunyi (bot mengisi → tolak submit)
 * - Tidak pakai library eksternal (React 19 form actions native)
 * - Validasi client-side sebelum submit
 *
 * Login gating (Phase 3+): sampai autentikasi asli tersedia (Phase 6),
 * submit → alert + redirect /login.
 */
export function InquiryForm() {
  const router = useRouter();

  // Client-side validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const data = new FormData(form);

    // Honeypot check — bot terdeteksi kalau field tersembunyi "website" terisi.
    // Dibaca langsung dari FormData (uncontrolled) agar tahan terhadap bot yang
    // set DOM value tanpa melewati event React.
    const website = String(data.get("website") ?? "").trim();
    if (website) {
      // Silent block: bot tidak menerima sinyal sukses/gagal, data tidak dikirim.
      return;
    }
    const nama = String(data.get("nama") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const perusahaan = String(data.get("perusahaan") ?? "").trim();
    const produk = String(data.get("produk") ?? "");
    const qty = String(data.get("qty") ?? "").trim();
    const pesan = String(data.get("pesan") ?? "").trim();

    // Validation
    const errs: Record<string, string> = {};
    if (!nama) errs.nama = "Nama wajib diisi";
    if (nama && nama.length < 3) errs.nama = "Nama minimal 3 karakter";
    if (!email) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Format email tidak valid";
    if (!perusahaan) errs.perusahaan = "Perusahaan wajib diisi";
    if (!produk) errs.produk = "Pilih produk";
    if (qty && isNaN(Number(qty))) errs.qty = "Qty harus angka";
    if (pesan.length > 2000) errs.pesan = "Pesan maksimal 2000 karakter";

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Skenario 3 (Phase 3+): login gating — hardcode belum-login
    // sampai sistem autentikasi otentik tersedia (Phase 6).
    alert("Daftar Atau Login Akun terlebih dahulu untuk mengirim inquiry.");
    router.push("/login");
    return;
  }

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="grid gap-5 sm:grid-cols-2"
        noValidate
      >
        {/* Nama */}
        <Field label="Nama Lengkap" htmlFor="nama" required error={errors.nama}>
          <Input
            id="nama"
            name="nama"
            placeholder="Ahmad Fauzi"
            className="bg-surface/50"
            aria-invalid={!!errors.nama}
          />
        </Field>

        {/* Email */}
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="buyer@perusahaan.com"
            className="bg-surface/50"
            aria-invalid={!!errors.email}
          />
        </Field>

        {/* Perusahaan */}
        <Field
          label="Perusahaan"
          htmlFor="perusahaan"
          required
          error={errors.perusahaan}
        >
          <Input
            id="perusahaan"
            name="perusahaan"
            placeholder="PT. Contoh Internasional"
            className="bg-surface/50"
            aria-invalid={!!errors.perusahaan}
          />
        </Field>

        {/* Produk */}
        <Field label="Produk" htmlFor="produk" required error={errors.produk}>
          <Select name="produk">
            <SelectTrigger id="produk" className="bg-surface/50 w-full">
              <SelectValue placeholder="Pilih produk" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Qty */}
        <Field label="Qty (kg)" htmlFor="qty" error={errors.qty}>
          <Input
            id="qty"
            name="qty"
            type="number"
            inputMode="numeric"
            min="1"
            placeholder="Misal: 1000"
            className="bg-surface/50"
            aria-invalid={!!errors.qty}
          />
        </Field>

        {/* Pesan */}
        <Field
          label="Pesan / Kebutuhan Khusus"
          htmlFor="pesan"
          className="sm:col-span-2"
          error={errors.pesan}
        >
          <Textarea
            id="pesan"
            name="pesan"
            rows={5}
            placeholder="Ceritakan kebutuhan Anda: volume, target negara, packaging spesial, dll."
            className="bg-surface/50 resize-none"
            aria-invalid={!!errors.pesan}
          />
        </Field>

        {/* Honeypot — bot mengisi field tersembunyi ini. Tanpa value/onChange
            (uncontrolled) supaya FormData benar-benar membaca DOM. */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            className="w-full bg-accent text-white transition-all hover:bg-accent-dark sm:w-auto"
          >
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            Kirim Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
}

/** Field — wrapper label + input + error message. */
function Field({
  label,
  htmlFor,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}