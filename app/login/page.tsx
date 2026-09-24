import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { AdminLoginForm } from '@/app/components/auth/admin-login-form';

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect if already logged in
  if (session) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}
