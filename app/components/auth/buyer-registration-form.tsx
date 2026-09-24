'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

const COUNTRIES = [
  { code: 'ID', name: 'Indonesia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
];

export function BuyerRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessSector: '',
    street: '',
    subdistrict: '',
    district: '',
    city: '',
    province: '',
    country: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Nama lengkap wajib diisi');
      return false;
    }
    if (!formData.whatsapp.trim()) {
      setError('No. WhatsApp wajib diisi');
      return false;
    }
    if (!/^\+\d{10,15}$/.test(formData.whatsapp)) {
      setError('Format No. WhatsApp tidak valid (gunakan +62...)');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email wajib diisi');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    if (!formData.password) {
      setError('Password wajib diisi');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return false;
    }
    if (!formData.businessSector) {
      setError('Sektor bisnis wajib dipilih');
      return false;
    }
    if (!formData.country) {
      setError('Negara wajib dipilih');
      return false;
    }
    if (!formData.city) {
      setError('Kota wajib diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registrasi gagal');
        setIsLoading(false);
        return;
      }

      // Redirect to verification page
      router.push(`/register/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Daftar Akun Buyer
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Isi data lengkap untuk membuat akun dan mulai memesan
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Informasi Pribadi
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                    Nama Lengkap *
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground">
                    No. WhatsApp *
                  </label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="+62812345678"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Gunakan format internasional (contoh: +62812345678)
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="buyer@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Informasi Bisnis
              </h3>
              <div>
                <label htmlFor="businessSector" className="block text-sm font-medium text-foreground">
                  Sektor Bisnis *
                </label>
                <select
                  id="businessSector"
                  name="businessSector"
                  value={formData.businessSector}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Pilih sektor bisnis</option>
                  {BUSINESS_SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Alamat
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-foreground">
                    Nama Jalan
                  </label>
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Jl. Example No. 123"
                    value={formData.street}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="subdistrict" className="block text-sm font-medium text-foreground">
                    Kelurahan
                  </label>
                  <Input
                    id="subdistrict"
                    name="subdistrict"
                    type="text"
                    placeholder="Kelurahan"
                    value={formData.subdistrict}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-foreground">
                    Kecamatan
                  </label>
                  <Input
                    id="district"
                    name="district"
                    type="text"
                    placeholder="Kecamatan"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground">
                    Kota/Kabupaten *
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Jakarta"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-foreground">
                    Provinsi
                  </label>
                  <Input
                    id="province"
                    name="province"
                    type="text"
                    placeholder="DKI Jakarta"
                    value={formData.province}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-foreground">
                    Negara *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Pilih negara</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Keamanan
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimal 8 karakter, dengan kombinasi huruf dan angka
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                    Konfirmasi Password *
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Mendaftar...' : 'Daftar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <a href="/login" className="text-accent hover:underline">
                Login di sini
              </a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
