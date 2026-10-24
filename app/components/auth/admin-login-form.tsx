'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PopupModal, DialogType } from '@/app/components/ui/popup-modal';
import { ChangePasswordModal } from '@/app/components/auth/change-password-modal';

export function AdminLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

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
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setModalState({
          isOpen: true,
          title: 'Login Gagal',
          description: result.error || 'Username/Email atau password tidak valid.',
          type: 'error',
        });
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        const res = await fetch('/api/auth/session');
        const session = await res.json();

        if (session?.user?.mustChangePassword) {
          setMustChangePassword(true);
          setIsLoading(false);
          return;
        }

        const role = session?.user?.role;

        setModalState({
          isOpen: true,
          title: 'Login Berhasil!',
          description: `Selamat datang, ${session?.user?.name || session?.user?.email || 'Pengguna'}! Anda berhasil masuk.`,
          type: 'success',
          onConfirm: () => {
            if (role === 'ADMIN') {
              router.push('/admin');
            } else {
              router.push('/');
            }
          },
        });

        setTimeout(() => {
          if (role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1200);
        return;
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        title: 'Kesalahan Sistem',
        description: 'Terjadi kesalahan jaringan atau server.',
        type: 'error',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 shadow-lg border-border/50">
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

      <ChangePasswordModal isOpen={mustChangePassword} />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Masuk / Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan Username atau Email serta Password Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground">
            Username atau Email
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username atau email@example.com"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="mt-1 bg-surface/50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
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
            className="mt-1 bg-surface/50"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent text-white hover:bg-accent-dark transition-all"
        >
          {isLoading ? 'Memproses Masuk...' : 'Masuk Sekarang'}
        </Button>
      </form>

      <div className="mt-6 rounded-md bg-accent/10 p-3 text-xs text-muted-foreground">
        <strong>Info:</strong> Buyer akan diarahkan ke Beranda utama, Admin akan diarahkan ke Dashboard ERP.
      </div>
    </Card>
  );
}
