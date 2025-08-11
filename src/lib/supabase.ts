// Configuración de Supabase para Grupo Rosso
const supabaseUrl = 'https://usnwpiauncxiumwuhzru.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDM2MzYsImV4cCI6MjA2NjM3OTYzNn0.8WKevqT5pZCCLhL13HmQzTfH1AMDv_TtdwnDXMdjO0g'

// Cliente para operaciones normales
export const supabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => makeRequest('GET', `/rest/v1/${table}?select=${columns}&${column}=eq.${value}`)
      })
    }),
    insert: (data: any) => ({
      select: () => makeRequest('POST', `/rest/v1/${table}`, data)
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => makeRequest('PATCH', `/rest/v1/${table}?${column}=eq.${value}`, data)
    })
  })
}

// Función para hacer peticiones HTTP a Supabase
async function makeRequest(method: string, path: string, data?: any) {
  const url = `${supabaseUrl}${path}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'apikey': supabaseAnonKey
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Error en la petición')
    }

    return { data: result, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Types for our users table
export interface User {
  id: string
  email: string
  password_hash: string
  role: 'vendedor' | 'distribuidor' | 'admin'
  name?: string
  active: boolean
  created_at: string
  last_login?: string
}

// Simple hash function (same as used in the database)
function simpleHash(password: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

// Auth functions
export async function loginUser(email: string, password: string) {
  try {
    console.log('🔍 Login attempt:', { email, password })
    
    // Get user from our custom users table
    const { data, error }: any = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single()
    
    const result = { data, error }

    console.log('📊 Supabase result:', result)

    if (result.error || !result.data) {
      console.log('❌ User not found:', result.error)
      return { success: false, error: 'Usuario no encontrado' }
    }

    const user = Array.isArray(result.data) ? result.data[0] : result.data
    console.log('👤 User found:', { email: user.email, role: user.role })

    // Verify password using simple hash
    const hashedPassword = simpleHash(password)
    console.log('🔐 Password comparison:', { 
      provided: hashedPassword, 
      stored: user.password_hash,
      match: hashedPassword === user.password_hash 
    })
    
    if (hashedPassword !== user.password_hash) {
      return { success: false, error: 'Contraseña incorrecta' }
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)

    return { 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Error en el servidor' }
  }
}

export async function createUser(email: string, password: string, role: 'vendedor' | 'distribuidor' | 'admin', name?: string) {
  try {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          role,
          name,
          active: true
        }
      ])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data[0] }
  } catch (error) {
    return { success: false, error: 'Error creando usuario' }
  }
}
