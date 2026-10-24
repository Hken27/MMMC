'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  Mail,
  Building2,
  MapPin,
  Lock,
  ShieldCheck,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
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
import { INTERNATIONAL_REGIONS } from '@/app/lib/regions';
import { getWorldwideCountries, getCountryRegions, getStateCities, getCityDistricts } from '@/app/lib/countries-api';

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

const COUNTRIES_DIAL = [
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'AE', name: 'Uni Emirat Arab', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arab Saudi', dial: '+966', flag: '🇸🇦' },
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

  // Dynamic countries & regions
  const [countries, setCountries] = useState<Array<{ code: string; name: string; dial: string }>>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

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
    phoneDial: '+62',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessSector: '',
    street: '',
    country: 'ID',
    province: '',
    city: '',
    district: '',
    verifyMethod: 'email',
  });

  const countryObj = INTERNATIONAL_REGIONS[formData.country] || INTERNATIONAL_REGIONS['ID'];
  const provinces = countryObj ? Object.keys(countryObj.provinces) : [];
  const citiesFromHardcoded = (formData.province && countryObj?.provinces[formData.province]) ? Object.keys(countryObj.provinces[formData.province]) : [];
  const districts = (formData.province && formData.city && countryObj?.provinces[formData.province]?.[formData.city]) ? countryObj.provinces[formData.province][formData.city] : [];

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      const fetchedCountries = await getWorldwideCountries();
      setCountries(fetchedCountries.length > 0 ? fetchedCountries : COUNTRIES_DIAL);
      setLoadingCountries(false);
    };
    fetchCountries();
  }, []);

  // Fetch regions when country changes
  useEffect(() => {
    const fetchRegions = async () => {
      if (formData.country) {
        // Check if country exists in hardcoded regions first
        if (INTERNATIONAL_REGIONS[formData.country]) {
          setRegions(Object.keys(INTERNATIONAL_REGIONS[formData.country].provinces));
        } else {
          // Fetch from API
          const fetchedRegions = await getCountryRegions(formData.country);
          setRegions(fetchedRegions);
        }
        setCities([]);
        setFormData((prev) => ({ ...prev, province: '', city: '', district: '' }));
      }
    };
    fetchRegions();
  }, [formData.country]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'country') {
        updated.province = '';
        updated.city = '';
        updated.district = '';
      } else if (name === 'province') {
        updated.city = '';
        updated.district = '';
      } else if (name === 'city') {
        updated.district = '';
      }
      return updated;
    });
  };

  // Send OTP & display directly in modal on device screen
  const handleSendOtp = async () => {
    const identifier = formData.verifyMethod === 'email' ? formData.email : `${formData.phoneDial}${formData.whatsapp}`;

    if (!formData.fullName.trim()) {
      setModalState({ isOpen: true, title: 'Nama Wajib Diisi', description: 'Masukkan nama lengkap Anda terlebih dahulu.', type: 'warning' });
      return;
    }
    if (!identifier || (formData.verifyMethod === 'email' && !formData.email) || (formData.verifyMethod === 'whatsapp' && !formData.whatsapp)) {
      setModalState({ isOpen: true, title: 'Kontak Belum Lengkap', description: `Mohon isi ${formData.verifyMethod === 'email' ? 'Email' : 'No. WhatsApp'} untuk menerima OTP.`, type: 'warning' });
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type: formData.verifyMethod }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim OTP');

      setOtpSent(true);
      setOtpCode(data.otpCode || ''); // Autofill or show to device
      setModalState({
        isOpen: true,
        title: 'OTP Masuk ke Perangkat!',
        description: `Pesan SMS/WhatsApp/Email berhasil diterima di perangkat Anda (${identifier}).\n\nKode OTP Anda: [ ${data.otpCode} ]`,
        type: 'success',
      });
    } catch (err: any) {
      setModalState({ isOpen: true, title: 'Gagal Kirim OTP', description: err.message || 'Terjadi kesalahan.', type: 'error' });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const identifier = formData.verifyMethod === 'email' ? formData.email : `${formData.phoneDial}${formData.whatsapp}`;

    if (!otpCode || otpCode.length < 6) {
      setModalState({ isOpen: true, title: 'Kode OTP Tidak Valid', description: 'Masukkan 6 digit kode OTP.', type: 'warning' });
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code: otpCode, type: formData.verifyMethod }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Kode OTP salah');

      setOtpVerified(true);
      setModalState({
        isOpen: true,
        title: 'Verifikasi OTP Berhasil!',
        description: 'Perangkat dan kontak Anda telah terverifikasi. Silakan lanjutkan ke Profil Bisnis dan Alamat.',
        type: 'success',
        onConfirm: () => {
          setStep(2);
        },
      });
    } catch (err: any) {
      setModalState({ isOpen: true, title: 'Verifikasi Gagal', description: err.message || 'Kode OTP salah atau kedaluwarsa.', type: 'error' });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessSector || !formData.country || !formData.province || !formData.city || !formData.password) {
      setModalState({ isOpen: true, title: 'Form Belum Lengkap', description: 'Mohon lengkapi seluruh field profil bisnis, alamat, dan password.', type: 'warning' });
      return;
    }

    if (formData.password.length < 8 || formData.password !== formData.confirmPassword) {
      setModalState({ isOpen: true, title: 'Password Tidak Sesuai', description: 'Pastikan password minimal 8 karakter dan konfirmasi password cocok.', type: 'warning' });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        whatsapp: `${formData.phoneDial}${formData.whatsapp.replace(/\s|-/g, '')}`,
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
    } catch (err: any) {
      setModalState({ isOpen: true, title: 'Kesalahan Sistem', description: err.message || 'Gagal menyimpan data.', type: 'error' });
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
          {step === 1 ? 'Penerimaan OTP ke Perangkat' : 'Profil Bisnis & Alamat Internasional'}
        </h1>
        <p className="mt-3 mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          {step === 1
            ? 'Kirim dan terima kode OTP real langsung di perangkat Anda via Email / SMS / WhatsApp.'
            : 'Selesaikan pengisian sektor bisnis, cascading alamat internasional, dan kata sandi akun.'}
        </p>
      </motion.div>

      <Card className="overflow-hidden border-border/60 shadow-xl shadow-black/5">
        <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <SectionTitle icon={User} title="1. Masukkan Kontak & Terima OTP di Perangkat" subtitle="Pilih metode kirim ke perangkat Anda" />

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
              <label className="mb-1.5 block text-sm font-medium text-foreground">No. WhatsApp / SMS *</label>
              <div className="flex gap-2">
                <Select value={formData.phoneDial} onValueChange={(v) => handleSelectChange('phoneDial', v)}>
                  <SelectTrigger className="w-[100px] shrink-0">
                    <SelectValue placeholder="Kode" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES_DIAL.map((c) => (
                      <SelectItem key={c.code} value={c.dial}>
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          {c.dial}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="whatsapp"
                  type="tel"
                  placeholder="812345678"
                  value={formData.whatsapp}
                  onChange={handleTextChange}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email Perangkat *</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  name="email"
                  type="email"
                  placeholder="buyer@example.com"
                  value={formData.email}
                  onChange={handleTextChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-surface/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Kirim OTP ke Perangkat via:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectChange('verifyMethod', 'email')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      formData.verifyMethod === 'email' ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-background'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectChange('verifyMethod', 'whatsapp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      formData.verifyMethod === 'whatsapp' ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-background'
                    }`}
                  >
                    SMS / WhatsApp
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full bg-accent text-white hover:bg-accent-dark h-11 text-sm font-semibold"
              >
                {sendingOtp ? 'Mengirim ke Perangkat...' : 'Kirim OTP ke Perangkat'}
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
                <span className="text-sm font-semibold">OTP Perangkat Terverifikasi! Silakan lanjut.</span>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!otpVerified}
                className="bg-accent text-white hover:bg-accent-dark gap-2"
              >
                Lanjut ke Profil Bisnis &amp; Alamat
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleFinalizeRegistration} className="p-6 sm:p-8 space-y-6">
            <SectionTitle icon={Building2} title="2. Profil Bisnis & Alamat Internasional" subtitle="Lengkapi detail lokasi dan kata sandi akun" />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Sektor Bisnis *</label>
              <Select value={formData.businessSector} onValueChange={(v) => handleSelectChange('businessSector', v)}>
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Negara (Country) *</label>
              <Select value={formData.country} onValueChange={(v) => handleSelectChange('country', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Negara" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INTERNATIONAL_REGIONS).map(([code, reg]) => (
                    <SelectItem key={code} value={code}>{reg.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Provinsi / State *</label>
              <Select value={formData.province} onValueChange={(v) => handleSelectChange('province', v)} disabled={provinces.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={provinces.length > 0 ? "Pilih Provinsi/State" : "Pilih Negara terlebih dahulu"} />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((prov) => (
                    <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Kota / City *</label>
              <Select value={formData.city} onValueChange={(v) => handleSelectChange('city', v)} disabled={!formData.province || cities.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={formData.province ? "Pilih Kota/City" : "Pilih Provinsi terlebih dahulu"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((ct) => (
                    <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Distrik / Area</label>
              <Select value={formData.district} onValueChange={(v) => handleSelectChange('district', v)} disabled={!formData.city || districts.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={formData.city ? "Pilih Distrik/Area" : "Pilih Kota terlebih dahulu"} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <ArrowLeft className="h-4 w-4" />
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
