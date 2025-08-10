// Tipos de TypeScript para NextAuth.js
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'Admin' | 'Vendedor' | 'Distribuidor';
      company?: string;
      phone?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Vendedor' | 'Distribuidor';
    company?: string;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'Admin' | 'Vendedor' | 'Distribuidor';
    company?: string;
    phone?: string;
  }
}
