'use client';

import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
