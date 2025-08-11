// Script para configurar Supabase automáticamente
// Crea la tabla de usuarios y los usuarios iniciales

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabaseUrl = 'https://usnwpiauncxiumwuhzru.supabase.co'
const supabaseServiceKey = 'sbp_a58a0d011de6c0dac62e35ac7d84988503aa63a5'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupSupabase() {
  console.log('🚀 Configurando Supabase para Grupo Rosso...')

  try {
    // 1. Crear la tabla de usuarios usando RPC (más confiable)
    console.log('📋 Creando tabla de usuarios...')
    
    const { data: createTableResult, error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
    })

    if (createTableError) {
      console.log('⚠️  Intentando crear tabla con método alternativo...')
      // Método alternativo: usar SQL directo
      const { error: altError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      if (altError && altError.message.includes('relation "users" does not exist')) {
        console.log('❌ La tabla no existe. Necesitas crearla manualmente en el dashboard de Supabase.')
        console.log('📝 SQL para copiar y pegar:')
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
        return
      }
    } else {
      console.log('✅ Tabla de usuarios creada exitosamente')
    }

    // 2. Crear usuarios iniciales
    console.log('👥 Creando usuarios iniciales...')

    const users = [
      {
        email: 'vendedor@gruporosso.com',
        password: '123456',
        role: 'vendedor',
        name: 'Usuario Vendedor'
      },
      {
        email: 'distribuidor@gruporosso.com',
        password: '123456',
        role: 'distribuidor',
        name: 'Usuario Distribuidor'
      },
      {
        email: 'admin@gruporosso.com',
        password: '123456',
        role: 'admin',
        name: 'Administrador'
      }
    ]

    for (const user of users) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10)

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', user.email)
          .single()

        if (existingUser) {
          console.log(`⚠️  Usuario ya existe: ${user.email}`)
          continue
        }

        // Insert user
        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              email: user.email,
              password_hash: hashedPassword,
              role: user.role,
              name: user.name,
              active: true
            }
          ])
          .select()

        if (error) {
          console.error(`❌ Error creando ${user.email}:`, error.message)
        } else {
          console.log(`✅ Usuario creado: ${user.email} (${user.role})`)
        }
      } catch (err) {
        console.error(`❌ Error con ${user.email}:`, err.message)
      }
    }

    console.log('\n🎉 Configuración de Supabase completada!')
    console.log('\n📋 Usuarios creados:')
    console.log('• vendedor@gruporosso.com / 123456 (rol: vendedor)')
    console.log('• distribuidor@gruporosso.com / 123456 (rol: distribuidor)')
    console.log('• admin@gruporosso.com / 123456 (rol: admin)')
    console.log('\n🔗 Ahora puedes probar el login en: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Error general:', error.message)
    console.log('\n📝 Si hay problemas, crea la tabla manualmente en Supabase:')
    console.log('1. Ve a https://supabase.com/dashboard/project/usnwpiauncxiumwuhzru')
    console.log('2. Ve a SQL Editor')
    console.log('3. Ejecuta el SQL que se muestra arriba')
  }
}

setupSupabase()
