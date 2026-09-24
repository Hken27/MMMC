import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user && (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface/20">
      <div className="w-full max-w-2xl rounded-lg border border-border/50 bg-card p-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-muted-foreground">
          Coming Soon — Phase 5
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Selamat datang, <strong>{session.user?.email}</strong>
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/"
            className="rounded-md border border-accent/40 px-4 py-2 text-accent hover:bg-accent/10 transition-colors"
          >
            Kembali ke Beranda
          </a>
          <button
            onClick={() => {
              // Logout akan diimplementasi kemudian
              window.location.href = '/api/auth/signout';
            }}
            className="rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/90 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
