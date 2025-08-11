// Script para crear usuarios iniciales en Supabase
// Ejecutar con: node src/scripts/setup-users.js

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

const supabaseUrl = 'https://usnwpiauncxiumwuhzru.supabase.co'
const supabaseServiceKey = 'sbp_a58a0d011de6c0dac62e35ac7d84988503aa63a5'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUsers() {
  console.log('🔧 Creando usuarios iniciales...')

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

  console.log('🎉 Proceso completado')
}

createUsers()
