"use client";

import { motion } from "motion/react";
import { LogIn, ShoppingBag, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * OrderRoadmap — visual 5 tahap alur order produk.
 * Horizontal di desktop, vertikal di mobile.
 */
const STEPS = [
  {
    icon: LogIn,
    title: "Login Account",
    desc: "Daftar atau masuk akun buyer untuk memulai proses order.",
  },
  {
    icon: ShoppingBag,
    title: "Order Product",
    desc: "Pilih produk, tentukan MOQ, packaging, dan quantity sesuai kebutuhan.",
  },
  {
    icon: CreditCard,
    title: "Transaction",
    desc: "Lakukan pembayaran sesuai invoice. Tersedia berbagai metode pembayaran.",
  },
  {
    icon: Truck,
    title: "Delivery",
    desc: "Pengiriman via logistik internasional atau domestik sesuai pilihan Anda.",
  },
  {
    icon: CheckCircle2,
    title: "Order Completed",
    desc: "Pesanan berhasil diterima. Kami siap membantu order selanjutnya.",
  },
];

export function OrderRoadmap() {
  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          ALUR ORDER
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Roadmap <span className="text-accent">Order Produk</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          5 tahap sederhana dari pendaftaran hingga pesanan sampai di tangan Anda.
        </p>
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connecting line */}
          <div className="absolute left-[calc(10%)] right-[calc(10%)] top-6 h-0.5 bg-border/50" />
          <div className="absolute left-[calc(10%)] top-6 h-0.5 w-0 bg-accent/60" style={{ width: "80%" }} />

          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} total={STEPS.length} layout="horizontal" />
          ))}
        </div>
      </div>

      {/* Mobile: vertical stepper */}
      <div className="md:hidden">
        <div className="relative flex flex-col gap-6 pl-8">
          {/* Vertical connecting line */}
          <div className="absolute left-3 top-0 h-full w-0.5 bg-border/50" />
          <div className="absolute left-3 top-0 h-0 w-0.5 bg-accent/60" style={{ height: "100%" }} />

          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} total={STEPS.length} layout="vertical" />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  total,
  layout,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  layout: "horizontal" | "vertical";
}) {
  const Icon = step.icon;
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        layout === "horizontal"
          ? "relative flex w-1/5 flex-col items-center text-center"
          : "relative"
      )}
    >
      {/* Circle node */}
      <div
        className={cn(
          "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isLast
            ? "border-accent bg-accent text-white"
            : "border-border bg-surface text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      {/* Step label + desc */}
      <div className={cn(layout === "horizontal" ? "mt-3" : "absolute left-6 top-1 ml-3")}>
        <p className="text-xs font-semibold text-muted-foreground">Langkah {index + 1}</p>
        <h4 className="mt-0.5 text-sm font-semibold text-foreground">{step.title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
      </div>
    </motion.div>
  );
}
