import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // Si no hay sesión, redirigir al login
  if (!session) {
    redirect('/admin/login');
  }
  
  // Si hay sesión, redirigir al dashboard
  redirect('/admin/dashboard');
}
