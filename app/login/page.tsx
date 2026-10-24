'use client';

import { useState } from 'react';
import { AdminLoginForm } from '@/app/components/auth/admin-login-form';
import { BuyerRegistrationForm } from '@/app/components/auth/buyer-registration-form';
import { motion, AnimatePresence } from 'motion/react';
import { Particles } from '@/app/components/effects/particles';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-surface via-background to-surface/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ====== Motion Background (React Bits Particles) ====== */}
      <Particles className="inset-0 z-0" quantity={70} staticity={55} ease={60} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Tab Toggle */}
        <motion.div
          className="mb-10 flex gap-2 rounded-xl border border-border/40 bg-background/60 p-1.5 shadow-lg backdrop-blur-xl"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                mode === m
                  ? 'text-white'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {mode === m && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-lg bg-accent shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{m === 'login' ? 'Masuk' : 'Daftar'}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {mode === 'login' ? <AdminLoginForm /> : <BuyerRegistrationForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}