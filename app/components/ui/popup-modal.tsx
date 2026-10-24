"use client";

import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DialogType = "info" | "success" | "warning" | "error";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: DialogType;
  confirmLabel?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

export function PopupModal({
  isOpen,
  onClose,
  title,
  description,
  type = "info",
  confirmLabel = "Mengerti",
  onConfirm,
  showCancel = false,
}: PopupModalProps) {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="h-6 w-6 text-accent" />,
    success: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    error: <XCircle className="h-6 w-6 text-destructive" />,
  };

  const bgIcons = {
    info: "bg-accent/10",
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    error: "bg-destructive/10",
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bgIcons[type]}`}>
            {icons[type]}
          </div>
          <div className="space-y-1 pr-4">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/50">
          {showCancel && (
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Batal
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className="rounded-xl bg-accent text-white hover:bg-accent-dark transition-all px-5"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
