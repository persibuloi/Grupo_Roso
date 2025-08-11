import { NextRequest, NextResponse } from 'next/server'

// Simple hash function (same as used in the database)
function simpleHash(password: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

// Helper function to make HTTP requests to Supabase
async function makeRequest(url: string, options: any = {}) {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://usnwpiauncxiumwuhzru.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgwMzYzNiwiZXhwIjoyMDY2Mzc5NjM2fQ.NUQoTlec7UziEZb_CjM0vF261qcs-3_hjkV8PBrlHJ8'

  const response = await fetch(`${supabaseUrl}/rest/v1/${url}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// GET - List all users
export async function GET() {
  try {
    console.log('🔍 Fetching users from Supabase...')
    
    const users = await makeRequest('users?select=*&order=created_at.desc')
    
    console.log(`✅ Found ${users.length} users`)
    
    return NextResponse.json({
      success: true,
      users: users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        created_at: user.created_at
      }))
    })
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al cargar usuarios',
      users: []
    }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, role, active } = body

    console.log('➕ Creating new user:', { email, name, role, active })

    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son requeridos'
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = simpleHash(password)

    // Create user in Supabase
    const newUser = await makeRequest('users', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        password: hashedPassword,
        role,
        active: active !== undefined ? active : true
      })
    })

    console.log('✅ User created successfully:', newUser[0]?.email)

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser[0]
    })
  } catch (error) {
    console.error('❌ Error creating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear usuario'
    }, { status: 500 })
  }
}
