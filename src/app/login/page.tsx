'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Debug function to test inputs
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Email input changed:', e.target.value)
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Password input changed:', e.target.value)
    setPassword(e.target.value)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 Login attempt:', { email, password: password ? '***' : 'empty' })
    setLoading(true)
    setError('')

    try {
      const result = await loginUser(email, password)
      console.log('🔐 Login result:', result)
      
      if (result.success && result.user) {
        // Store user info in localStorage (simple approach)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        // Redirect based on role
        if (result.user.role === 'vendedor') {
          router.push('/inventario/vendedores')
        } else if (result.user.role === 'distribuidor') {
          router.push('/inventario/distribuidores')
        } else if (result.user.role === 'admin') {
          router.push('/inventario/admin')
        }
      } else {
        setError(result.error || 'Error de autenticación')
      }
    } catch (err) {
      console.error('🔐 Login error:', err)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Grupo Rosso</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso al Sistema
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para consultar el inventario
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="tu@gruporosso.com"
                  style={{ pointerEvents: 'auto', userSelect: 'text' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  style={{ pointerEvents: 'auto', userSelect: 'text' }}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-xs text-gray-500">
              <p>Credenciales de prueba:</p>
              <p>vendedor@gruporosso.com / 123456</p>
              <p>distribuidor@gruporosso.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
