"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalUsers: number;
  totalInventoryValue: number;
  categoryStats: Record<string, number>;
  recentActivity: Array<{
    id: string;
    action: string;
    userEmail: string;
    timestamp: string;
    details: string;
  }>;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    // Cargar estadísticas reales
    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Error cargando estadísticas');
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-anthracite flex items-center justify-center">
        <div className="text-white-soft">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-anthracite flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">❌ {error}</div>
          <button 
            onClick={fetchStats}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const userRole = session.user.role;
  const userName = session.user.name;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar title="Dashboard" />
      
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Grupo Roso - {userName} ({userRole})</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchStats}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-anthracite-light p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Productos</p>
                <p className="text-2xl font-bold text-white-soft">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.lowStockProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <span className="text-white text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Inventario</p>
                <p className="text-2xl font-bold text-gray-900">₡{stats?.totalInventoryValue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-anthracite-light rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white-soft">Actividad Reciente</h3>
            {stats?.lastUpdated && (
              <p className="text-xs text-gray-400 mt-1">
                Última actualización: {new Date(stats.lastUpdated).toLocaleString('es-CR')}
              </p>
            )}
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recentActivity?.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {activity.userEmail?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white-soft">
                      <span className="font-medium">{activity.userEmail}</span> - {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{activity.details}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('es-CR')}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-400 text-center py-4">No hay actividad reciente</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Role Based */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white-soft mb-4">Accesos Rápidos</h2>
          
          {/* Admin Actions */}
          {userRole === 'Admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <button 
                onClick={() => router.push('/admin/catalogo-vendedores')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">🛍️ Catálogo Vendedores</h3>
                <p className="text-blue-100 text-sm">Ver productos con precios retail</p>
              </button>
              <button 
                onClick={() => router.push('/admin/catalogo-distribuidores')}
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">💰 Catálogo Distribuidores</h3>
                <p className="text-green-100 text-sm">Ver productos con precios mayoreo</p>
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg transition-colors text-left">
                <h3 className="text-lg font-medium mb-2">👥 Gestión de Usuarios</h3>
                <p className="text-purple-100 text-sm">Administrar vendedores y distribuidores</p>
              </button>
              <button 
                onClick={() => router.push('/catalogo')}
                className="bg-rosso hover:bg-rosso-dark text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">🌐 Catálogo Público</h3>
                <p className="text-red-100 text-sm">Ver catálogo de clientes</p>
              </button>
            </div>
          )}

          {/* Vendor Actions */}
          {userRole === 'Vendedor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <button 
                onClick={() => router.push('/admin/catalogo-vendedores')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">🛍️ Mi Catálogo</h3>
                <p className="text-blue-100 text-sm">Ver productos con precios retail</p>
              </button>
              <button 
                onClick={() => router.push('/catalogo')}
                className="bg-rosso hover:bg-rosso-dark text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">🌐 Catálogo Público</h3>
                <p className="text-red-100 text-sm">Ver catálogo de clientes</p>
              </button>
            </div>
          )}

          {/* Distributor Actions */}
          {userRole === 'Distribuidor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <button 
                onClick={() => router.push('/admin/catalogo-distribuidores')}
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">💰 Mi Catálogo Mayoreo</h3>
                <p className="text-green-100 text-sm">Ver productos con precios mayoreo</p>
              </button>
              <button 
                onClick={() => router.push('/catalogo')}
                className="bg-rosso hover:bg-rosso-dark text-white p-6 rounded-lg transition-colors text-left"
              >
                <h3 className="text-lg font-medium mb-2">🌐 Catálogo Público</h3>
                <p className="text-red-100 text-sm">Ver catálogo de clientes</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
