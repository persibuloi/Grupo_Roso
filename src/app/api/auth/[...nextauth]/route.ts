// Configuración simplificada de NextAuth.js para el panel de administración
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
