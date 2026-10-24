"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PopupModal, DialogType } from "@/app/components/ui/popup-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS } from "@/lib/products";

interface OrderConfig {
  productId: string;
  productName: string;
  deliveryType: string;
  moq: string;
  packaging: string;
  shipping: string;
  qtyKg: number;
  subtotal: number;
}

export function InquiryForm() {
  const router = useRouter();
  const t = useTranslations("Inquiry");
  const tp = useTranslations("Product");

  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [orderConfig, setOrderConfig] = useState<OrderConfig | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    perusahaan: "",
    produk: "",
    qty: "",
    pesan: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: DialogType;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info',
  });

  useEffect(() => {
    setMounted(true);

    // Read session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSession(data);
          // Auto-fill nama & email dari session
          setFormData((prev) => ({
            ...prev,
            nama: data.user.name || data.user.username || "",
            email: data.user.email || "",
          }));
        }
      })
      .catch(() => {});

    // Read orderConfig dari sessionStorage
    if (typeof window !== "undefined") {
      const readOrderConfig = () => {
        const saved = sessionStorage.getItem("orderConfig");
        if (saved) {
          try {
            const config = JSON.parse(saved);
            setOrderConfig(config);
          } catch (err) {
            // Invalid JSON, ignore
          }
        }
      };

      readOrderConfig();

      // Listen untuk custom event dari ProductOrder
      const handleOrderConfigUpdated = (e: Event) => {
        readOrderConfig();
      };

      window.addEventListener("orderConfigUpdated", handleOrderConfigUpdated);
      return () => window.removeEventListener("orderConfigUpdated", handleOrderConfigUpdated);
    }
  }, []);

  // Separate effect untuk update form saat orderConfig berubah
  useEffect(() => {
    if (orderConfig) {
      setFormData((prev) => ({
        ...prev,
        produk: orderConfig.productId || "",
        qty: orderConfig.qtyKg?.toString() || "",
      }));
    }
  }, [orderConfig]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const nama = formData.nama.trim();
    const email = formData.email.trim();
    const perusahaan = formData.perusahaan.trim();
    const produk = formData.produk;
    const qty = formData.qty.trim();
    const pesan = formData.pesan.trim();

    const errs: Record<string, string> = {};
    if (!nama) errs.nama = t("errNameRequired");
    if (nama && nama.length < 3) errs.nama = t("errNameMin");
    if (!email) errs.email = t("errEmailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t("errEmailFormat");
    if (!perusahaan) errs.perusahaan = t("errCompanyRequired");
    if (!produk) errs.produk = t("errProductRequired");
    if (qty && isNaN(Number(qty))) errs.qty = t("errQtyNumber");
    if (pesan.length > 2000) errs.pesan = t("errMessageMax");

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Check if buyer is logged in
    if (!session || !session.user) {
      setModalState({
        isOpen: true,
        title: 'Daftar Atau Login Akun',
        description: t("loginGate"),
        type: 'warning',
        onConfirm: () => router.push('/login'),
      });
      return;
    }

    // Logged in -> Submit inquiry to database
    try {
      const res = await fetch('/api/inquiry/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          email,
          perusahaan,
          produk,
          qty,
          pesan,
          orderConfig: orderConfig || undefined, // Include order config if available
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal mengirim inquiry');

      setModalState({
        isOpen: true,
        title: 'Inquiry Berhasil Dikirim!',
        description: `Pesan inquiry Anda berhasil dikirim dan tersimpan di database dengan nomor ${result.inquiryNumber}. Tim kami akan segera merespons.`,
        type: 'success',
        onConfirm: () => {
          setFormData({
            nama: session?.user?.name || session?.user?.username || "",
            email: session?.user?.email || "",
            perusahaan: "",
            produk: "",
            qty: "",
            pesan: "",
          });
          setOrderConfig(null);
          setErrors({});
          // Clear sessionStorage setelah sukses submit
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("orderConfig");
          }
        },
      });
    } catch (err: any) {
      setModalState({
        isOpen: true,
        title: 'Pengiriman Gagal',
        description: err.message || 'Terjadi kesalahan pada server.',
        type: 'error',
      });
    }
  }

  return (
    <div className="relative">
      <PopupModal
        isOpen={modalState.isOpen}
        onClose={() => {
          const fn = modalState.onConfirm;
          setModalState((prev) => ({ ...prev, isOpen: false }));
          if (fn) fn();
        }}
        title={modalState.title}
        description={modalState.description}
        type={modalState.type}
        confirmLabel="Tutup"
      />

      {/* Order Config Loaded Alert */}
      {orderConfig && (
        <div className="mb-5 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-accent">
          <p className="font-medium">✓ Konfigurasi Order Terbaca</p>
          <p className="mt-1 text-xs text-accent/80">
            Produk: <strong>{orderConfig.productName}</strong> | Qty: <strong>{orderConfig.qtyKg} kg</strong> | Subtotal: <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(orderConfig.subtotal)}</strong>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 sm:grid-cols-2"
        noValidate
      >
        {/* Nama */}
        <Field label={t("name")} htmlFor="nama" required error={errors.nama}>
          <Input
            id="nama"
            name="nama"
            placeholder={t("namePlaceholder")}
            value={formData.nama}
            onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
            className="bg-surface/50"
            aria-invalid={!!errors.nama}
          />
        </Field>

        {/* Email */}
        <Field label={t("email")} htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="bg-surface/50"
            aria-invalid={!!errors.email}
          />
        </Field>

        {/* Perusahaan */}
        <Field
          label={t("company")}
          htmlFor="perusahaan"
          required
          error={errors.perusahaan}
        >
          <Input
            id="perusahaan"
            name="perusahaan"
            placeholder={t("companyPlaceholder")}
            value={formData.perusahaan}
            onChange={(e) => setFormData((prev) => ({ ...prev, perusahaan: e.target.value }))}
            className="bg-surface/50"
            aria-invalid={!!errors.perusahaan}
          />
        </Field>

        {/* Produk — auto-select dari orderConfig */}
        <Field label={t("product")} htmlFor="produk" required error={errors.produk}>
          <Select value={formData.produk} onValueChange={(val) => setFormData((prev) => ({ ...prev, produk: val }))}>
            <SelectTrigger id="produk" className="bg-surface/50 w-full">
              <SelectValue placeholder={t("productPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => {
                const key = p.id === "shisha" ? "shisha" : p.id === "bbq" ? "bbq" : "quick";
                return (
                  <SelectItem key={p.id} value={p.id}>
                    {tp(`${key}.name`)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Field>

        {/* Qty — auto-fill dari orderConfig */}
        <Field label={t("qty")} htmlFor="qty" error={errors.qty}>
          <Input
            id="qty"
            name="qty"
            type="number"
            inputMode="numeric"
            min="1"
            placeholder={t("qtyPlaceholder")}
            value={formData.qty}
            onChange={(e) => setFormData((prev) => ({ ...prev, qty: e.target.value }))}
            className="bg-surface/50"
            aria-invalid={!!errors.qty}
          />
        </Field>

        {/* Pesan */}
        <Field
          label={t("message")}
          htmlFor="pesan"
          className="sm:col-span-2"
          error={errors.pesan}
        >
          <Textarea
            id="pesan"
            name="pesan"
            rows={5}
            placeholder={t("messagePlaceholder")}
            value={formData.pesan}
            onChange={(e) => setFormData((prev) => ({ ...prev, pesan: e.target.value }))}
            className="bg-surface/50 resize-none"
            aria-invalid={!!errors.pesan}
          />
        </Field>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">{t("honeypotWebsite")}</Label>
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
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}

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
