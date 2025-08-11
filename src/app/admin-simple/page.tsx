'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  image?: string
}

export default function SimpleAdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    categories: 0
  })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load products from API
  useEffect(() => {
    if (!mounted) return

    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (data.products) {
          setProducts(data.products)
          
          // Calculate stats
          const totalProducts = data.products.length
          const totalValue = data.products.reduce((sum: number, p: Product) => sum + (p.price * p.stock), 0)
          const lowStock = data.products.filter((p: Product) => p.stock < 5).length
          const categories = new Set(data.products.map((p: Product) => p.category)).size
          
          setStats({ totalProducts, totalValue, lowStock, categories })
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [mounted])

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Nombre', 'Categoría', 'Marca', 'Precio', 'Stock', 'Valor Total']
    const csvData = products.map(p => [
      p.name,
      p.category,
      p.brand,
      p.price,
      p.stock,
      p.price * p.stock
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventario-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Cargando panel de administración...</div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#dc2626' }}>🚀 Panel de Administración Simple</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Grupo Rosso - Gestión de Inventario</p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>📦 Total Productos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.totalProducts}</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>💰 Valor Total</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            ${stats.totalValue.toLocaleString()}
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>⚠️ Stock Bajo</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.lowStock}</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7c3aed' }}>🏷️ Categorías</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.categories}</p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>🛠️ Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={exportToCSV}
            style={{
              padding: '10px 20px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📊 Exportar CSV
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🔄 Actualizar Datos
          </button>

          <button
            onClick={() => window.open('/catalogo', '_blank')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🌐 Ver Catálogo Público
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>📋 Lista de Productos</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Producto</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Categoría</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Marca</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Precio</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Valor</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} style={{ 
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    <strong>{product.name}</strong>
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {product.category}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                    {product.brand}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                    ${(product.price || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                    {product.stock || 0}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>
                    ${((product.price || 0) * (product.stock || 0)).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: product.stock > 5 ? '#dcfce7' : '#fef2f2',
                      color: product.stock > 5 ? '#166534' : '#dc2626'
                    }}>
                      {product.stock > 5 ? '✅ Disponible' : '⚠️ Bajo Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        padding: '20px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>🚀 Panel de Administración Simple - Grupo Rosso</p>
        {mounted && <p>Última actualización: {new Date().toLocaleString()}</p>}
      </div>
    </div>
  )
}
