'use client';

export default function BasicAdminPanel() {
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
        <h1 style={{ margin: 0, color: '#dc2626' }}>🚀 Panel de Administración Básico</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Grupo Rosso - Acceso Directo</p>
      </div>

      {/* Quick Stats */}
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
          <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>📦 Sistema</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Operativo</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#059669' }}>🌐 API</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Conectada</p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7c3aed' }}>⚡ Estado</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Activo</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>🛠️ Acciones Rápidas</h2>
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          
          <a 
            href="/api/products" 
            target="_blank"
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            📊 Ver API de Productos
          </a>

          <a 
            href="/catalogo" 
            target="_blank"
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#059669',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            🌐 Ver Catálogo Público
          </a>

          <a 
            href="/" 
            target="_blank"
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#7c3aed',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            🏠 Ver Homepage
          </a>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '15px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Recargar Panel
          </button>
        </div>
      </div>

      {/* System Info */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>ℹ️ Información del Sistema</h2>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔗 Enlaces Directos</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>API Productos:</strong> <code>/api/products</code></li>
              <li><strong>Catálogo:</strong> <code>/catalogo</code></li>
              <li><strong>Homepage:</strong> <code>/</code></li>
              <li><strong>Este Panel:</strong> <code>/admin-basic</code></li>
            </ul>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '6px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>💡 Funcionalidades Disponibles</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>✅ Acceso directo sin login</li>
              <li>✅ Enlaces a todas las secciones</li>
              <li>✅ Panel simple y funcional</li>
              <li>✅ Sin errores de hidratación</li>
            </ul>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '6px',
            border: '1px solid #bae6fd'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>🎯 Próximos Pasos</h4>
            <p style={{ margin: 0 }}>
              Este panel básico funciona como punto de partida. 
              Desde aquí puedes acceder a todas las funcionalidades del sistema 
              y verificar que todo esté operativo.
            </p>
          </div>
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
        <p>🚀 Panel de Administración Básico - Grupo Rosso</p>
        <p>Versión simple y funcional</p>
      </div>
    </div>
  )
}
