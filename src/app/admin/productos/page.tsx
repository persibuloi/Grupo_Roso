'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  priceRetail: number;
  priceWholesale: number;
  stock: number;
  category: string;
  brand: string;
  active: boolean;
  createdTime: string;
  stockStatus: 'normal' | 'low' | 'critical' | 'out_of_stock';
}

interface ProductsData {
  products: Product[];
  total: number;
  lowStock: number;
  outOfStock: number;
}

export default function ProductsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Error cargando productos');
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchProducts(); // Recargar datos
        setEditingProduct(null);
        return true;
      } else {
        setError(result.error || 'Error actualizando producto');
        return false;
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error('Error updating product:', err);
      return false;
    }
  };

  const deactivateProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchProducts(); // Recargar datos
      } else {
        setError(result.error || 'Error desactivando producto');
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error('Error deactivating product:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-anthracite flex items-center justify-center">
        <div className="text-white-soft">Cargando productos...</div>
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
            onClick={fetchProducts}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const userRole = session.user.role;
  const filteredProducts = data?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'low_stock' && ['low', 'critical', 'out_of_stock'].includes(product.stockStatus)) ||
                         (filterStatus === 'active' && product.active) ||
                         (filterStatus === 'inactive' && !product.active);
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'low': return 'text-yellow-400';
      case 'critical': return 'text-orange-400';
      case 'out_of_stock': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Stock Bajo';
      case 'critical': return 'Crítico';
      case 'out_of_stock': return 'Agotado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-anthracite">
      {/* Header */}
      <div className="bg-anthracite-light border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white-soft">Gestión de Productos</h1>
              <p className="text-gray-400 mt-1">
                {data?.total || 0} productos • {data?.lowStock || 0} con stock bajo • {data?.outOfStock || 0} agotados
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Dashboard
              </button>
              {userRole === 'Admin' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-rosso hover:bg-rosso-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Agregar Producto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-anthracite-light p-4 rounded-lg border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-anthracite border border-gray-600 rounded-lg px-4 py-2 text-white-soft focus:outline-none focus:border-rosso"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-anthracite border border-gray-600 rounded-lg px-4 py-2 text-white-soft focus:outline-none focus:border-rosso"
              >
                <option value="all">Todos los productos</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
                <option value="low_stock">Stock bajo</option>
              </select>
            </div>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-anthracite-light rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white-soft">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.category} • {product.brand}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white-soft">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white-soft">
                        <div>Retail: ₡{product.priceRetail?.toLocaleString()}</div>
                        {userRole === 'Admin' && (
                          <div className="text-gray-400">Mayoreo: ₡{product.priceWholesale?.toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${getStockStatusColor(product.stockStatus)}`}>
                        {product.stock} unidades
                      </div>
                      <div className={`text-xs ${getStockStatusColor(product.stockStatus)}`}>
                        {getStockStatusText(product.stockStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        {(userRole === 'Admin' || userRole === 'Vendedor') && (
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            ✏️ Editar
                          </button>
                        )}
                        {userRole === 'Admin' && product.active && (
                          <button
                            onClick={() => deactivateProduct(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️ Desactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No se encontraron productos que coincidan con los filtros
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-anthracite-light p-6 rounded-lg border border-gray-700 w-full max-w-md">
            <h3 className="text-lg font-medium text-white-soft mb-4">Editar Producto</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updates = {
                name: formData.get('name') as string,
                priceRetail: Number(formData.get('priceRetail')),
                priceWholesale: Number(formData.get('priceWholesale')),
                stock: Number(formData.get('stock')),
                description: formData.get('description') as string,
              };
              updateProduct(editingProduct.id, updates);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingProduct.name}
                    className="w-full bg-anthracite border border-gray-600 rounded px-3 py-2 text-white-soft focus:outline-none focus:border-rosso"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Precio Retail</label>
                  <input
                    name="priceRetail"
                    type="number"
                    defaultValue={editingProduct.priceRetail}
                    className="w-full bg-anthracite border border-gray-600 rounded px-3 py-2 text-white-soft focus:outline-none focus:border-rosso"
                    required
                  />
                </div>
                {userRole === 'Admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Precio Mayoreo</label>
                    <input
                      name="priceWholesale"
                      type="number"
                      defaultValue={editingProduct.priceWholesale}
                      className="w-full bg-anthracite border border-gray-600 rounded px-3 py-2 text-white-soft focus:outline-none focus:border-rosso"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={editingProduct.stock}
                    className="w-full bg-anthracite border border-gray-600 rounded px-3 py-2 text-white-soft focus:outline-none focus:border-rosso"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct.description}
                    rows={3}
                    className="w-full bg-anthracite border border-gray-600 rounded px-3 py-2 text-white-soft focus:outline-none focus:border-rosso"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white-soft"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-rosso hover:bg-rosso-dark text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
