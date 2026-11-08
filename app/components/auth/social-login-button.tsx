'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface SocialLoginButtonProps {
  provider: 'google' | 'apple';
  isLoading?: boolean;
}

/**
 * Social Login Button — Premium Design System Integration
 * Colors: Charcoal #0B0F19 + Emerald #10B981 accent
 * Spec: Phase 4.11.1
 */
export function SocialLoginButton({
  provider,
  isLoading = false,
}: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signIn(provider, { callbackUrl: '/' });
    setLoading(false);
  };

  const config = {
    google: {
      label: 'Google',
      shortLabel: 'Google Sign In',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#1f2937"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34a853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#fbbc05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#ea4335"
          />
        </svg>
      ),
    },
    apple: {
      label: 'Apple',
      shortLabel: 'Apple Sign In',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.05 13.5c-.91 2.04-.73 3.56 1.15 5.16 1.1.87 2.93 1.39 4.08 1.39.07 0 .13 0 .2-.01-.36 1.12-2.55 4.19-5.3 4.19-2.4 0-3.83-.93-6.02-.93-2.31 0-3.74.98-6 .98-3.07 0-5.63-2.89-6.48-5.81-.63-2.06-.98-4.29-.98-6.31C-1.94 7.54.42 4.56 3.14 4.56c2.01 0 3.28.93 4.95.93 1.54 0 2.66-.93 4.87-.93 2.78 0 5.23 1.85 6.15 4.63-3.1 1.74-3.39 5.04-1.26 7.1zm-4.08-10.2c.19-1.37-.5-2.75-1.53-3.26-1.02-.52-2.37-.15-2.95 1.22-.58 1.36.07 2.92 1.1 3.44 1.02.52 2.38.15 2.96-1.22-.02-.07-.02-.13-.02-.18z" />
        </svg>
      ),
    },
  };

  const { label, shortLabel, icon } = config[provider];
  const isApple = provider === 'apple';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || isLoading}
      className={`
        relative w-full px-4 py-3.5 rounded-lg font-medium text-sm
        transition-all duration-300 ease-out
        flex items-center justify-center gap-2.5

        ${
          isApple
            ? `
              bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900
              border border-slate-800 dark:border-slate-200
              hover:bg-black dark:hover:bg-white
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            `
            : `
              bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100
              border border-slate-200 dark:border-slate-700
              hover:bg-white dark:hover:bg-slate-800
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            `
        }

        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        shadow-sm hover:shadow-md
      `}
      aria-label={shortLabel}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{loading || isLoading ? 'Loading...' : `${label}`}</span>
    </button>
  );
}

/**
 * Social Login Container — Premium Minimalist Layout
 * Design: Clean, premium, integrated with design system
 */
export function SocialLoginContainer() {
  return (
    <div className="space-y-5 pt-4">
      {/* Section Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent" />
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Or Continue
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-slate-300 dark:from-slate-700 to-transparent" />
      </div>

      {/* Social Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        <SocialLoginButton provider="google" />
        <SocialLoginButton provider="apple" />
      </div>

      {/* Security Note */}
      <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
        Secure sign-in powered by OAuth 2.0
        <br />
        Your data is protected
      </p>
    </div>
  );
}
