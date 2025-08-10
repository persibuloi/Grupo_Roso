"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (result?.ok) {
        // Login exitoso, redirigir al dashboard
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Grupo Roso
          </h1>
          <p className="text-gray-600">
            Panel de Administración
          </p>
        </div>

        {/* Formulario de login */}
        <Card className="bg-white border-gray-300">
          <CardHeader>
            <CardTitle className="text-black text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="admin@gruporoso.com"
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Botón de login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Información de credenciales por defecto (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-md">
                <p className="text-blue-800 text-sm font-medium mb-2">
                  Credenciales por defecto:
                </p>
                <p className="text-blue-700 text-xs">
                  Email: admin@gruporoso.com<br />
                  Contraseña: Admin123!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Grupo Roso. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
