'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginUser } from '@/lib/supabase'

function LoginBypassContent() {
  const [status, setStatus] = useState('Procesando...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const user = searchParams.get('user')
    
    if (!user) {
      setStatus('Selecciona un usuario para hacer login automático')
      return
    }

    const credentials = {
      admin: { email: 'admin@gruporosso.com', password: '123456' },
      vendedor: { email: 'vendedor@gruporosso.com', password: '123456' },
      distribuidor: { email: 'distribuidor@gruporosso.com', password: '123456' }
    }

    const cred = credentials[user as keyof typeof credentials]
    
    if (!cred) {
      setStatus('Usuario no válido')
      return
    }

    // Auto login
    const performLogin = async () => {
      try {
        setStatus(`Iniciando sesión como ${user}...`)
        const result = await loginUser(cred.email, cred.password)
        
        if (result.success && result.user) {
          localStorage.setItem('user', JSON.stringify(result.user))
          setStatus(`✅ Login exitoso! Redirigiendo...`)
          
          // Redirect based on role
          setTimeout(() => {
            if (result.user.role === 'vendedor') {
              router.push('/inventario/vendedores')
            } else if (result.user.role === 'distribuidor') {
              router.push('/inventario/distribuidores')
            } else if (result.user.role === 'admin') {
              router.push('/inventario/admin')
            }
          }, 1000)
        } else {
          setStatus(`❌ Error: ${result.error}`)
        }
      } catch (err) {
        setStatus(`❌ Error de conexión: ${err}`)
      }
    }

    performLogin()
  }, [searchParams, router])

  const handleUserClick = (userType: string) => {
    window.location.href = `/login-bypass?user=${userType}`
  }

  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#dc2626', marginBottom: '30px' }}>
        🚀 Grupo Rosso - Login Rápido
      </h1>
      
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2>Estado: {status}</h2>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Selecciona tu rol para acceso directo:</h3>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleUserClick('admin')}
          style={{
            padding: '15px 25px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          👑 ADMIN
        </button>

        <button
          onClick={() => handleUserClick('vendedor')}
          style={{
            padding: '15px 25px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🛍️ VENDEDOR
        </button>

        <button
          onClick={() => handleUserClick('distribuidor')}
          style={{
            padding: '15px 25px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          📦 DISTRIBUIDOR
        </button>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>💡 <strong>Solución temporal</strong> mientras se resuelve el problema del formulario</p>
        <p>🔐 Credenciales automáticas: todos usan contraseña "123456"</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Links Directos:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <a href="/login-bypass?user=admin" style={{ color: '#dc2626', textDecoration: 'none', fontSize: '16px' }}>
            🔗 Login como Admin
          </a>
          <a href="/login-bypass?user=vendedor" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '16px' }}>
            🔗 Login como Vendedor
          </a>
          <a href="/login-bypass?user=distribuidor" style={{ color: '#059669', textDecoration: 'none', fontSize: '16px' }}>
            🔗 Login como Distribuidor
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginBypassPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        padding: '50px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '30px' }}>
          🚀 Grupo Rosso - Login Rápido
        </h1>
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2>Cargando...</h2>
        </div>
      </div>
    }>
      <LoginBypassContent />
    </Suspense>
  )
}
