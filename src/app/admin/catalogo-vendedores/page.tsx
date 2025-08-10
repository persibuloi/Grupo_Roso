'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
// Iconos SVG simples
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  priceRetail: number;
  priceWholesale: number;
  stock: number;
  category: { id: string; name: string; slug: string; description: string };
  brand: { id: string; name: string; slug: string; description: string };
  active: boolean;
  image: string;
  stockStatus: 'normal' | 'low' | 'critical' | 'out_of_stock';
}

export default function CatalogoVendedores() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showOnlyStock, setShowOnlyStock] = useState(false);

  // Verificar autenticación y permisos
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    if (!['Admin', 'Vendedor'].includes(session.user.role)) {
      router.push('/admin/dashboard');
      return;
    }
  }, [session, status, router]);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔄 Iniciando carga de productos...');
        
        const response = await fetch('/api/admin/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        
        console.log('📡 Respuesta API status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 Datos recibidos:', data);
          console.log('📦 Tipo de data:', typeof data);
          console.log('📦 data.success:', data.success);
          console.log('📦 data.data:', data.data);
          console.log('📦 Es array data.data?:', Array.isArray(data.data));
          
          if (data.success && Array.isArray(data.data)) {
            setProducts(data.data);
            console.log('✅ Productos encontrados:', data.data.length);
            console.log('✅ Primer producto:', data.data[0]);
          } else if (data.success && data.data && data.data.products) {
            // Fallback: maybe it's nested under data.products
            setProducts(data.data.products);
            console.log('✅ Productos encontrados (nested):', data.data.products.length);
          } else {
            console.log('❌ Estructura de datos no reconocida');
            console.log('❌ data.success:', data.success);
            console.log('❌ data.data type:', typeof data.data);
          }
        } else {
          console.error('❌ Error API:', response.status);
        }
      } catch (error) {
        console.error('❌ Error de conexión:', error);
      }
      
      // Always exit loading state
      setLoading(false);
    };

    fetchProducts();
  }, [session]);

  // Calcular filtros directamente sin useState para evitar problemas de hidratación
  const categories = useMemo(() => {
    if (products.length === 0) return [];
    
    const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
    const catMap = new Map<string, any>();
    
    for (const p of products) {
      const cname = p.category?.name || '';
      if (cname) {
        const cslug = p.category?.slug || slugify(cname);
        if (!catMap.has(cslug)) {
          catMap.set(cslug, { id: cslug, name: cname, slug: cslug, description: '' });
        }
      }
    }
    
    const result = Array.from(catMap.values());
    console.log('🔍 CATEGORIES CALCULATED:', result.map(c => c.name));
    return result;
  }, [products]);

  const brands = useMemo(() => {
    if (products.length === 0) return [];
    
    const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
    const brandMap = new Map<string, any>();
    
    for (const p of products) {
      const bname = p.brand?.name || '';
      if (bname) {
        const bslug = p.brand?.slug || slugify(bname);
        if (!brandMap.has(bslug)) {
          brandMap.set(bslug, { id: bslug, name: bname, slug: bslug, description: '' });
        }
      }
    }
    
    const result = Array.from(brandMap.values());
    console.log('🔍 BRANDS CALCULATED:', result.map(b => b.name));
    return result;
  }, [products]);

  // Filtrar productos
  useEffect(() => {
    console.log('🔍 APLICANDO FILTROS:');
    console.log('🔍 searchTerm:', searchTerm);
    console.log('🔍 selectedCategory:', selectedCategory);
    console.log('🔍 selectedBrand:', selectedBrand);
    console.log('🔍 showOnlyStock:', showOnlyStock);
    console.log('🔍 Total productos:', products.length);

    let filtered = products.filter(product => {
      // Filtro de búsqueda
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoría (usando objetos)
      const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;

      // Filtro de marca (usando objetos)
      const matchesBrand = !selectedBrand || product.brand?.name === selectedBrand;

      // Filtro de stock
      const matchesStock = !showOnlyStock || (product.stock && product.stock > 0);

      const passes = matchesSearch && matchesCategory && matchesBrand && matchesStock;
      
      if (!passes && (selectedCategory || selectedBrand)) {
        console.log('🔍 PRODUCTO FILTRADO:', product.name, 
          'cat:', product.category?.name, 'brand:', product.brand?.name);
      }

      return passes;
    });

    console.log('🔍 Productos filtrados:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedBrand, showOnlyStock]);

  const exportToCSV = () => {
    try {
      const headers = ['Código', 'Producto', 'Descripción', 'Categoría', 'Marca', 'Precio Retail', 'Stock', 'Estado'];
      
      const csvData = filteredProducts.map(product => [
        product.sku || product.id,
        `"${product.name}"`,
        `"${product.description || ''}"`,
        product.category || '',
        product.brand || '',
        product.priceRetail || 0,
        product.stock || 0,
        product.stock > 0 ? 'Disponible' : 'Sin Stock'
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `catalogo-vendedores-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar CSV');
    }
  };

  const printCatalog = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Catálogo de Vendedores - Grupo Roso</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1e40af; margin-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .price { font-weight: bold; color: #1e40af; }
            .stock-ok { color: #16a34a; }
            .stock-out { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1>Catálogo de Vendedores - Grupo Roso</h1>
          <div class="meta">
            <p>Generado: ${new Date().toLocaleDateString()}</p>
            <p>Total de productos: ${filteredProducts.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio Retail</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filteredProducts.map(product => `
                <tr>
                  <td>${product.sku || product.id}</td>
                  <td>${product.name}</td>
                  <td>${product.category || 'N/A'}</td>
                  <td>${product.brand || 'N/A'}</td>
                  <td class="price">₡${product.priceRetail?.toLocaleString() || 'N/A'}</td>
                  <td>${product.stock || 0}</td>
                  <td class="${product.stock > 0 ? 'stock-ok' : 'stock-out'}">
                    ${product.stock > 0 ? 'Disponible' : 'Sin Stock'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Force exit loading after 5 seconds if stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('🚨 FORCING EXIT FROM LOADING STATE');
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar title="Catálogo de Vendedores" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catálogo de Vendedores</h1>
              <p className="text-gray-600 mt-1">Productos ({filteredProducts.length})</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DownloadIcon />
                Exportar CSV
              </button>
              <button
                onClick={printCatalog}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileTextIcon />
                Imprimir/PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría {categories.length > 0 ? `(${categories.length})` : '(0)'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  console.log('🔍 CATEGORY CHANGED:', e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="" className="text-black bg-white">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name} className="text-black bg-white">{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca {brands.length > 0 ? `(${brands.length})` : '(0)'}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  console.log('🔍 BRAND CHANGED:', e.target.value);
                  setSelectedBrand(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              >
                <option value="" className="text-black bg-white">Todas las marcas</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name} className="text-black bg-white">{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyStock}
                  onChange={(e) => setShowOnlyStock(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Solo con stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Retail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.sku || product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      ₡{product.priceRetail?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'Disponible' : 'Sin Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No se encontraron productos</div>
              <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
