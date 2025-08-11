// Script para crear tabla y usuarios usando API REST de Supabase
const https = require('https')

const SUPABASE_URL = 'https://usnwpiauncxiumwuhzru.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgwMzYzNiwiZXhwIjoyMDY2Mzc5NjM2fQ.NUQoTlec7UziEZb_CjM0vF261qcs-3_hjkV8PBrlHJ8'

// Función para hacer peticiones HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'usnwpiauncxiumwuhzru.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    }

    if (data) {
      const jsonData = JSON.stringify(data)
      options.headers['Content-Length'] = Buffer.byteLength(jsonData)
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {}
          resolve({ status: res.statusCode, data: parsed })
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data) {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

// Función para hashear contraseñas (simple hash para demo)
function simpleHash(password) {
  // Para producción usar bcrypt, aquí usamos hash simple para demo
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

async function setupSupabase() {
  console.log('🚀 Configurando Supabase usando API REST...')

  try {
    // 1. Crear tabla usando SQL via RPC
    console.log('📋 Creando tabla de usuarios...')
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text UNIQUE NOT NULL,
        password_hash text NOT NULL,
        role text NOT NULL CHECK (role IN ('vendedor', 'distribuidor', 'admin')),
        name text,
        active boolean DEFAULT true,
        created_at timestamp DEFAULT now(),
        last_login timestamp
      );
    `

    const rpcResult = await makeRequest('POST', '/rest/v1/rpc/exec_sql', {
      sql: createTableSQL
    })

    if (rpcResult.status === 200 || rpcResult.status === 201) {
      console.log('✅ Tabla creada exitosamente')
    } else {
      console.log('⚠️  Tabla posiblemente ya existe o error:', rpcResult.data)
    }

    // 2. Crear usuarios
    console.log('👥 Creando usuarios...')

    const users = [
      {
        email: 'vendedor@gruporosso.com',
        password_hash: simpleHash('123456'),
        role: 'vendedor',
        name: 'Usuario Vendedor',
        active: true
      },
      {
        email: 'distribuidor@gruporosso.com',
        password_hash: simpleHash('123456'),
        role: 'distribuidor',
        name: 'Usuario Distribuidor',
        active: true
      },
      {
        email: 'admin@gruporosso.com',
        password_hash: simpleHash('123456'),
        role: 'admin',
        name: 'Administrador',
        active: true
      }
    ]

    for (const user of users) {
      try {
        const result = await makeRequest('POST', '/rest/v1/users', user)
        
        if (result.status === 201) {
          console.log(`✅ Usuario creado: ${user.email} (${user.role})`)
        } else if (result.status === 409) {
          console.log(`⚠️  Usuario ya existe: ${user.email}`)
        } else {
          console.log(`❌ Error creando ${user.email}:`, result.data)
        }
      } catch (error) {
        console.error(`❌ Error con ${user.email}:`, error.message)
      }
    }

    console.log('\n🎉 Configuración completada!')
    console.log('\n📋 Credenciales de acceso:')
    console.log('• vendedor@gruporosso.com / 123456')
    console.log('• distribuidor@gruporosso.com / 123456')
    console.log('• admin@gruporosso.com / 123456')
    console.log('\n🔗 Prueba el login en: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Error general:', error.message)
    console.log('\n📝 Si hay problemas, puedes crear la tabla manualmente:')
    console.log('1. Ve a https://supabase.com/dashboard/project/usnwpiauncxiumwuhzru')
    console.log('2. Ve a SQL Editor y ejecuta:')
    console.log(`
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('vendedor', 'distribuidor', 'admin')),
  name text,
  active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  last_login timestamp
);
    `)
  }
}

setupSupabase()
