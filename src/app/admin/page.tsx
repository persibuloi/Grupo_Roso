import { redirect } from 'next/navigation';

export default async function AdminPage() {
  // Redirigir al nuevo sistema de login con Supabase
  redirect('/login');
}
