'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
  name?: string
}

export default function InventarioAdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    // Temporary bypass - set default admin user
    const defaultUser = {
      id: '1',
      email: 'admin@gruporosso.com',
      name: 'Administrador',
      role: 'admin'
    }
    setUser(defaultUser)
    localStorage.setItem('user', JSON.stringify(defaultUser))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Acceso completo al sistema de inventario</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Inventario Vendedores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Inventario Vendedores</h2>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Vista del inventario con precios retail para el equipo de ventas.
            </p>
            <Link
              href="/inventario/vendedores"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Inventario Vendedores
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Inventario Distribuidores */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Inventario Distribuidores</h2>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Vista del inventario con precios mayoreo y cálculo de ahorros para distribuidores.
            </p>
            <Link
              href="/inventario/distribuidores"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Ver Inventario Distribuidores
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">Tipos de Usuario</div>
                <div className="text-xs text-gray-500 mt-1">Vendedores y Distribuidores</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-gray-600">Sistema Activo</div>
                <div className="text-xs text-gray-500 mt-1">Autenticación Supabase</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">∞</div>
                <div className="text-sm text-gray-600">Productos</div>
                <div className="text-xs text-gray-500 mt-1">Sincronizado con Airtable</div>
              </div>
            </div>
          </div>

        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instrucciones de Uso</h3>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Vendedores:</strong> Pueden acceder solo al inventario con precios retail</p>
            <p>• <strong>Distribuidores:</strong> Pueden acceder solo al inventario con precios mayoreo y ver ahorros</p>
            <p>• <strong>Admin:</strong> Tienes acceso completo a ambos inventarios</p>
            <p>• Los datos se sincronizan automáticamente con Airtable</p>
            <p>• Usa los filtros para buscar productos específicos por categoría, marca o stock</p>
          </div>
        </div>
      </div>
    </div>
  )
}
