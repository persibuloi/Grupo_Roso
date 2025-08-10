// Middleware para proteger rutas del panel de administración
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Permitir acceso a la página de login
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    // Verificar que el usuario esté autenticado para rutas admin
    if (pathname.startsWith('/admin')) {
      if (!token) {
        // Redirigir a login si no está autenticado
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verificar roles específicos para ciertas rutas
      const userRole = token.role as string;

      // Solo admins pueden acceder a gestión de usuarios
      if (pathname.startsWith('/admin/usuarios') && userRole !== 'Admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      // Solo admins pueden modificar productos
      if (pathname.startsWith('/admin/productos/edit') && userRole !== 'Admin') {
        return NextResponse.redirect(new URL('/admin/productos', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Solo intervenimos en /admin, login siempre permitido
        if (pathname.startsWith('/admin/login')) return true;
        if (pathname.startsWith('/admin')) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
