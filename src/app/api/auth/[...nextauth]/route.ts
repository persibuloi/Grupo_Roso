// Configuración simplificada de NextAuth.js para el panel de administración
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Crear handler con configuración explícita para Next.js 15
const handler = NextAuth(authOptions);

// Exportar métodos HTTP explícitamente para compatibilidad con Next.js 15
export const GET = handler;
export const POST = handler;
