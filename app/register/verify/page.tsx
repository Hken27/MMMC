'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PopupModal } from '@/app/components/ui/popup-modal';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('email') || searchParams.get('phone') || '';
  const type = searchParams.get('type') || 'email';
  const username = searchParams.get('username') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successPopup, setSuccessPopup] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (code.length < 6) {
      setError('Kode OTP harus 6 digit.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verifikasi gagal');
      }

      setSuccessPopup(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface/30 flex items-center justify-center p-4">
      <PopupModal
        isOpen={successPopup}
        onClose={() => {
          setSuccessPopup(false);
          router.push('/login');
        }}
        title="Pendaftaran & Verifikasi Berhasil!"
        description={`Akun Anda telah aktif sepenuhnya. Pesan konfirmasi beserta Username (${username}) dan Password Anda telah dikirimkan ke ${type === 'email' ? 'Email' : 'No. WhatsApp'} Anda (${identifier}). Silakan masuk untuk mulai memesan.`}
        type="success"
        confirmLabel="Lanjut ke Halaman Masuk"
      />

      <Card className="w-full max-w-md p-6 sm:p-8 shadow-xl border-border/50">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-3">
            {type === 'email' ? <Mail className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
          </div>
          <h1 className="text-xl font-bold text-foreground">Verifikasi {type === 'email' ? 'Email' : 'No. WhatsApp'}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Masukkan kode OTP 6 digit yang telah dikirim ke <span className="font-semibold text-foreground">{identifier || 'tujuan Anda'}</span>.
          </p>
          <div className="mt-2 inline-block rounded bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
            Tip Testing: Gunakan kode <strong className="font-bold">123456</strong>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Kode OTP (6 Digit)</label>
            <Input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="text-center text-lg tracking-widest font-mono bg-surface/50"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-accent text-white hover:bg-accent-dark">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              'Verifikasi OTP'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
