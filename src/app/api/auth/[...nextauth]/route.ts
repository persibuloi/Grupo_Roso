// Configuración simplificada de NextAuth.js para el panel de administración
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Usuarios de prueba (en producción esto debería venir de Airtable)
const testUsers = [
  {
    id: '1',
    email: 'admin@gruporoso.com',
    password: 'Admin123!',
    name: 'Administrador',
    role: 'Admin',
    company: 'Grupo Roso',
    phone: '50588793873'
  },
  {
    id: '2',
    email: 'vendedor@gruporoso.com',
    password: 'Vendedor123!',
    name: 'Vendedor',
    role: 'Vendedor',
    company: 'Grupo Roso',
    phone: '50588793873'
  },
  {
    id: '3',
    email: 'distribuidor@gruporoso.com',
    password: 'Distribuidor123!',
    name: 'Distribuidor',
    role: 'Distribuidor',
    company: 'Grupo Roso',
    phone: '50588793873'
  }
];

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'admin@gruporoso.com'
        },
        password: { 
          label: 'Contraseña', 
          type: 'password' 
        }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Credenciales faltantes');
            return null;
          }

          // Buscar usuario en la lista de prueba
          const user = testUsers.find(
            u => u.email === credentials.email && u.password === credentials.password
          );

          if (!user) {
            console.log('❌ Usuario no encontrado o contraseña incorrecta');
            return null;
          }

          console.log('✅ Login exitoso para:', user.email, 'Rol:', user.role);

          // Retornar datos del usuario para la sesión
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as "Admin" | "Vendedor" | "Distribuidor",
            company: user.company,
            phone: user.phone
          } as any;

        } catch (error) {
          console.error('❌ Error en autorización:', error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },

  callbacks: {
    async jwt({ token, user }) {
      // Agregar datos del usuario al token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.company = (user as any).company;
        token.phone = (user as any).phone;
      }
      return token;
    },

    async session({ session, token }) {
      // Agregar datos del token a la sesión
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).company = token.company;
        (session.user as any).phone = token.phone;
      }
      return session;
    },

    async signIn({ user }) {
      // Permitir solo usuarios con roles válidos
      const validRoles = ['Admin', 'Vendedor', 'Distribuidor'];
      const userRole = (user as any).role;
      return validRoles.includes(userRole);
    }
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  secret: process.env.NEXTAUTH_SECRET || 'grupo-roso-secret-key-2024',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
