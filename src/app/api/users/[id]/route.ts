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

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json()
    const { email, name, password, role, active } = body
    const userId = params.id

    console.log('✏️ Updating user:', userId, { email, name, role, active })

    // Prepare update data
    const updateData: any = {}
    
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (role) updateData.role = role
    if (active !== undefined) updateData.active = active
    
    // Only hash password if provided
    if (password && password.trim() !== '') {
      updateData.password = simpleHash(password)
    }

    // Update user in Supabase
    const updatedUser = await makeRequest(`users?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })

    console.log('✅ User updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser[0]
    })
  } catch (error) {
    console.error('❌ Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al actualizar usuario'
    }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const userId = params.id

    console.log('🗑️ Deleting user:', userId)

    // Delete user from Supabase
    await makeRequest(`users?id=eq.${userId}`, {
      method: 'DELETE'
    })

    console.log('✅ User deleted successfully')

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al eliminar usuario'
    }, { status: 500 })
  }
}

// GET - Get single user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const userId = params.id

    console.log('🔍 Fetching user:', userId)

    const users = await makeRequest(`users?id=eq.${userId}`)
    
    if (!users || users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('❌ Error fetching user:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al cargar usuario'
    }, { status: 500 })
  }
}
