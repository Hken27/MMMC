"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, ArrowRight, LogIn, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { formatRupiah } from "@/lib/products";
import { PopupModal } from "@/app/components/ui/popup-modal";

type DeliveryType = "domestic" | "international";

type Selections = {
  productId: string;
  deliveryType: DeliveryType;
  moq: string | null;
  packaging: string | null;
  shipping: string | null;
  qtyKg: number;
};

/**
 * ProductOrder — kalkulator + selector tunggal untuk SEMUA produk.
 * i18n-enabled (label, tombol, error) via next-intl.
 */
export function ProductOrder({ products }: { products: Product[] }) {
  const router = useRouter();
  const t = useTranslations("Order");
  const tp = useTranslations("Product");
  const [sel, setSel] = useState<Selections>({
    productId: products[0]?.id ?? "",
    deliveryType: "domestic",
    moq: null,
    packaging: null,
    shipping: null,
    qtyKg: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const product = products.find((p) => p.id === sel.productId) ?? products[0];

  // Ganti produk → reset pilihan yang tergantung produk
  function selectProduct(id: string) {
    setSel((s) => ({ ...s, productId: id, moq: null, packaging: null, shipping: null }));
    setError(null);
  }

  if (!product) return null;

  const deliveryOptions =
    sel.deliveryType === "domestic" ? product.delivery.domestic : product.delivery.international;
  const packagingOptions = product.packaging;
  const allPackaging = [
    ...packagingOptions.masterBox.map((w) => ({ label: `${t("masterBox")} ${w} ${t("unitKg")}`, value: `master-${w}` })),
    ...packagingOptions.miniBox.map((w) => ({
      label: `${t("miniBox")} ${w >= 1000 ? w / 1000 + " " + t("unitKg") : w + " " + t("unitGram")}`,
      value: `mini-${w}`,
    })),
    ...packagingOptions.specialBox.map((w) => ({
      label: `${t("specialBox")} ${w >= 1000 ? w / 1000 + " " + t("unitTon") : w + " " + t("unitKg")}`,
      value: `special-${w}`,
    })),
  ];

  const subtotal = sel.qtyKg * product.pricePerKg;
  const complete = sel.moq && sel.packaging && sel.shipping && sel.qtyKg > 0;

  function handleSubmit() {
    if (!complete) {
      setError(t("completeAll"));
      return;
    }
    setError(null);
    setShowPopup(true);
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
      <PopupModal
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false);
          router.push("/login");
        }}
        title="Daftar Atau Login Akun"
        description={t("loginGate")}
        type="warning"
        confirmLabel="Ke Halaman Login"
      />
      {/* Title */}
      <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calculator className="h-4 w-4 text-accent" aria-hidden="true" />
        {t("configTitle")}
      </h4>

      {/* Pilih kategori briket */}
      <FieldGroup label={t("chooseProduct")}>
        <div className="flex flex-wrap gap-2">
          {products.map((p) => {
            const key = p.id === "shisha" ? "shisha" : p.id === "bbq" ? "bbq" : "quick";
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProduct(p.id)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  sel.productId === p.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                )}
              >
                {tp(`${key}.name`)}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t("priceLabel")}: <span className="font-medium text-accent">{formatRupiah(product.pricePerKg)}/kg</span>
        </p>
      </FieldGroup>

      {/* Domestik / Luar Negeri tab */}
      <div className="mb-4 flex rounded-lg bg-surface p-1">
        {(["domestic", "international"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSel((s) => ({ ...s, deliveryType: mode, shipping: null }))}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              sel.deliveryType === mode
                ? "bg-accent text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {mode === "domestic" ? `🇮🇩 ${t("domestic")}` : `🌏 ${t("international")}`}
          </button>
        ))}
      </div>

      {/* MOQ selector */}
      <FieldGroup label={t("moq")}>
        <div className="flex flex-wrap gap-2">
          {product.moq.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSel((s) => ({ ...s, moq: m }))}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                sel.moq === m
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* Packaging selector */}
      <FieldGroup label={t("packaging")}>
        <div className="flex flex-wrap gap-2">
          {allPackaging.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setSel((s) => ({ ...s, packaging: p.value }))}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                sel.packaging === p.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* Shipping selector */}
      <FieldGroup label={t("shipping")}>
        <div className="flex flex-wrap gap-2">
          {deliveryOptions.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSel((s) => ({ ...s, shipping: d }))}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                sel.shipping === d
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </FieldGroup>

      {/* Qty input */}
      <FieldGroup label={t("quantity")}>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          placeholder={t("qtyPlaceholder")}
          value={sel.qtyKg || ""}
          onChange={(e) => {
            const v = parseInt(e.target.value) || 0;
            setSel((s) => ({ ...s, qtyKg: v }));
            setError(null);
          }}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
      </FieldGroup>

      {/* Grand Total + Submit */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("pricePerKg")} ({tp(`${productKey(product.id)}.name`)})
          </p>
          <p className="text-sm font-medium text-foreground">{formatRupiah(product.pricePerKg)}/kg</p>
          {complete && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">{t("subtotal")} ({sel.qtyKg.toLocaleString("id-ID")} kg)</p>
              <p className="text-lg font-bold text-accent">{formatRupiah(subtotal)}</p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-all",
            complete
              ? "bg-accent text-white shadow-sm hover:bg-accent-dark hover:shadow-md"
              : "cursor-not-allowed bg-surface text-muted-foreground opacity-50"
          )}
        >
          {t("sendInquiry")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Error / login hint */}
      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-destructive" role="alert">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Note: login required */}
      {complete && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
          {t("loginRequired")}
        </p>
      )}
    </div>
  );
}

/** Map product id → i18n key. */
function productKey(id: string): "shisha" | "bbq" | "quick" {
  if (id === "shisha") return "shisha";
  if (id === "bbq") return "bbq";
  return "quick";
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}