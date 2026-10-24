import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user && (session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch Phase 4 data
  const totalUsers = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  const buyerCount = await prisma.user.count({ where: { role: 'BUYER' } });
  const verifiedBuyers = await prisma.user.count({
    where: { role: 'BUYER', verified: true },
  });
  const totalOrders = await prisma.order.count();
  const totalInquiries = await prisma.inquiry.count();

  const users = await prisma.user.findMany({
    include: { profile: true },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-surface/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Selamat datang, <strong>{session.user?.email}</strong>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Users</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{totalUsers}</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Admin</div>
            <div className="mt-2 text-3xl font-bold text-accent">{adminCount}</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Buyers</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{buyerCount}</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Verified Buyers</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{verifiedBuyers}</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Orders</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{totalOrders}</div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Inquiries</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{totalInquiries}</div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Verified</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4 text-foreground/80">{user.email}</td>
                    <td className="py-3 px-4 text-foreground/80">{user.username}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-foreground/10 text-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={user.verified ? 'text-green-600' : 'text-muted-foreground'}>
                        {user.verified ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground/80">
                      {user.profile?.fullName || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-foreground hover:bg-surface/40 transition-colors"
          >
            Kembali ke Beranda
          </a>
          <form
            action={async () => {
              'use server';
              await fetch('/api/auth/signout', { method: 'POST' });
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-white hover:bg-accent/90 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
