'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Building2,
  MapPin,
  Lock,
  Send,
  CheckCircle2,
  ArrowLeft,
  ArrowBigDown,
  ArrowBigLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PopupModal, DialogType } from '@/app/components/ui/popup-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HierarchicalAddressSelect } from '@/app/components/auth/hierarchical-address-select';

// Memoized to prevent re-renders from parent state changes
const HierarchicalAddressSelectMemo = React.memo(HierarchicalAddressSelect);

const BUSINESS_SECTORS = [
  'Retail',
  'Restaurant & Cafe',
  'Hotel & Hospitality',
  'Industrial',
  'Manufacturing',
  'Agriculture',
  'Export/Import',
  'Catering',
  'Other',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

export function BuyerRegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');

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

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessSector: '',
    street: '',
    country: 'ID',
    province: '',
    city: '',
    district: '',
    postalCode: '',
    phoneDial: '+62',
    whatsapp: '',
  });

  const [hierarchicalAddress, setHierarchicalAddress] = useState({
    country: 'ID',
    state: '',
    city: '',
    district: '',
    postalCode: '',
  });

  // Hierarchical address is now handled by HierarchicalAddressSelect component
  // Component manages country/state/city/district cascade & caching from PlaceDB

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Stable callback for hierarchical address changes — wrapped in useCallback to prevent re-renders
  const handleAddressChange = useCallback((address: {
    country: string;
    state: string;
    city: string;
    district?: string;
    postalCode?: string;
  }) => {
    setHierarchicalAddress(address);
    setFormData((prev) => ({
      ...prev,
      country: address.country,
      province: address.state,
      city: address.city,
      district: address.district || '',
      postalCode: address.postalCode || '',
    }));
  }, []);

  // Send OTP & display directly in modal on device screen
  const handleSendOtp = async () => {
    const identifier = formData.email;

    if (!formData.fullName.trim()) {
      setModalState({ isOpen: true, title: 'Nama Wajib Diisi', description: 'Masukkan nama lengkap Anda terlebih dahulu.', type: 'warning' });
      return;
    }
    if (!formData.email.trim()) {
      setModalState({ isOpen: true, title: 'Email Belum Diisi', description: 'Mohon isi Email untuk menerima OTP.', type: 'warning' });
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim OTP');

      setOtpSent(true);
      setOtpCode(data.otpCode || '');
      setModalState({
        isOpen: true,
        title: 'OTP Email Sudah Masuk!',
        description: data.otpCode
          ? `Cek Kode OTP di Email Anda ${identifier}.`
          : `${data.message || 'Kode OTP Email berhasil dikirim ke perangkat Anda. Silakan cek inbox Anda.'}`,
        type: 'success',
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Terjadi kesalahan.');
      setModalState({ isOpen: true, title: 'Gagal Kirim OTP', description: error.message || 'Terjadi kesalahan.', type: 'error' });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const identifier = formData.email;

    if (!otpCode || otpCode.length < 6) {
      setModalState({ isOpen: true, title: 'Kode OTP Tidak Valid', description: 'Masukkan 6 digit kode OTP.', type: 'warning' });
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Kode OTP salah');

      setOtpVerified(true);
      setModalState({
        isOpen: true,
        title: 'Verifikasi OTP Berhasil!',
        description: 'Email Anda telah terverifikasi.',
        type: 'success',
        onConfirm: () => {
          setStep(2);
        },
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Kode OTP salah atau kedaluwarsa.');
      setModalState({ isOpen: true, title: 'Verifikasi Gagal', description: error.message || 'Kode OTP salah atau kedaluwarsa.', type: 'error' });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessSector || !formData.country || !formData.password) {
      setModalState({ isOpen: true, title: 'Form Belum Lengkap', description: 'Mohon lengkapi field Sektor Bisnis, Negara, dan Password.', type: 'warning' });
      return;
    }

    // Province & city optional jika tidak tersedia untuk negara tersebut
    // Validation already handled by HierarchicalAddressSelect component

    if (formData.password.length < 8 || formData.password !== formData.confirmPassword) {
      setModalState({ isOpen: true, title: 'Password Tidak Sesuai', description: 'Pastikan password minimal 8 karakter dan konfirmasi password cocok.', type: 'warning' });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        businessSector: formData.businessSector,
        street: formData.street,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        whatsapp: `${formData.phoneDial}${formData.whatsapp}`.trim() || '',
        verified: true,
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

      setModalState({
        isOpen: true,
        title: 'Pendaftaran Selesai & Sukses!',
        description: `Akun Anda berhasil didaftarkan dengan Username: ${data.username}. Silakan masuk menggunakan password yang telah dibuat.`,
        type: 'success',
        onConfirm: () => {
          router.push('/login');
        },
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Gagal menyimpan data.');
      setModalState({ isOpen: true, title: 'Kesalahan Sistem', description: error.message || 'Gagal menyimpan data.', type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="mx-auto max-w-2xl" variants={containerVariants} initial="hidden" animate="visible">
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
        confirmLabel="Lanjutkan"
      />

      <motion.div className="mb-8 text-center" variants={sectionVariants}>
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          LANGKAH {step} DARI 2
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          {step === 1 ? 'Penerimaan OTP via Email' : 'Profil Bisnis & Alamat Internasional'}
        </h1>
        <p className="mt-3 mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          {step === 1
            ? 'Kirim dan terima kode OTP real langsung di Email Anda.'
            : 'Selesaikan pengisian sektor bisnis, cascading alamat internasional, dan kata sandi akun.'}
        </p>
      </motion.div>

      <Card className="overflow-hidden border-border/60 shadow-xl shadow-black/5">
        <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <SectionTitle icon={User} title="1. Masukkan Kontak & Verifikasi Email" subtitle="Kode OTP akan dikirim langsung ke Email Anda" />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nama Lengkap *</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleTextChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email Terverifikasi *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={handleTextChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-4">
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full bg-accent text-white hover:bg-accent-dark h-11 text-sm font-semibold"
              >
                {sendingOtp ? 'Mengirim Kode OTP Email...' : 'Kirim OTP ke Email'}
                <Send className="ml-2 h-4 w-4" />
              </Button>

              {otpSent && (
                <div className="space-y-3 pt-3 border-t border-border/60 animate-in fade-in duration-200">
                  <label className="block text-xs font-medium text-foreground">Masukkan 6 Digit OTP yang Masuk di Perangkat:</label>
                  <div className="flex gap-2">
                    <Input
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="text-center font-mono text-xl tracking-widest bg-background"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp}
                      className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 font-semibold"
                    >
                      {verifyingOtp ? 'Memverifikasi...' : 'Verifikasi'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {otpVerified && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">Email Terverifikasi! Silakan lanjut.</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleFinalizeRegistration} className="p-6 sm:p-8 space-y-6">
            <SectionTitle icon={Building2} title="2. Profil Bisnis & Alamat Internasional" subtitle="Lengkapi detail lokasi dan kata sandi akun" />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Sektor Bisnis *</label>
              <Select value={formData.businessSector} onValueChange={(v) => setFormData((prev) => ({ ...prev, businessSector: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih sektor bisnis" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_SECTORS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Global Hierarchical Address — Phase 4.11.2 */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-5">
              <h4 className="mb-4 text-sm font-semibold text-foreground">Alamat Internasional Hierarki</h4>
              <HierarchicalAddressSelectMemo
                onAddressChange={handleAddressChange}
                defaultCountry={formData.country}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nama Jalan &amp; Nomor</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  name="street"
                  placeholder="Jl. Raya / Street Address"
                  value={formData.street}
                  onChange={handleTextChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="border-t border-border/60 pt-6 space-y-4">
              <SectionTitle icon={Lock} title="Keamanan Akun" subtitle="Buat password minimal 8 karakter" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Password *</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleTextChange}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Konfirmasi Password *</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleTextChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowBigLeft className="h-4 w-4" />
                Kembali ke OTP
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-accent text-white hover:bg-accent-dark"
              >
                {isLoading ? 'Menyimpan...' : 'Selesaikan Pendaftaran'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </motion.div>
  );
}
