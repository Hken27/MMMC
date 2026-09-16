"use client";

import { useState } from "react";
import { Search, Package } from "lucide-react";

/**
 * OrderTracking — input Order ID + area status.
 * Sistem tracking dinamis belum tersedia (Phase 6).
 * UI siap dikembangkan, tanpa data palsu.
 */
export function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearched(true);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          ORDER TRACKING
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lacak <span className="text-accent">Pesanan</span> Anda
        </h3>
      </div>

      {/* Search input */}
      <form onSubmit={handleSearch} className="mx-auto flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Masukkan Order ID"
            value={orderId}
            onChange={(e) => { setOrderId(e.target.value); setSearched(false); }}
            className="w-full rounded-md border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Cari
        </button>
      </form>

      {/* Tracking result area */}
      {searched && (
        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border/50 bg-card p-6 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Order ID: <span className="text-accent">{orderId}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Sistem tracking dinamis tersedia di fase berikutnya.
            <br />
            Untuk saat ini, silakan hubungi tim kami melalui WhatsApp atau email.
          </p>
        </div>
      )}
    </div>
  );
}
