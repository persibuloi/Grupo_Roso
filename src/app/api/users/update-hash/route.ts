import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://usnwpiauncxiumwuhzru.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgwMzYzNiwiZXhwIjoyMDY2Mzc5NjM2fQ.NUQoTlec7UziEZb_CjM0vF261qcs-3_hjkV8PBrlHJ8';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Iniciando actualización de hash de contraseña...');
    
    const { email, password_hash } = await request.json();
    
    if (!email || !password_hash) {
      console.log('❌ Faltan parámetros: email o password_hash');
      return NextResponse.json({
        success: false,
        error: 'Email y password_hash son requeridos'
      }, { status: 400 });
    }

    console.log(`📝 Actualizando hash para: ${email}`);
    console.log(`🔑 Nuevo hash: ${password_hash.substring(0, 20)}...`);

    // Actualizar el hash en Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        password_hash: password_hash
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`❌ Error de Supabase: ${response.status} - ${errorData}`);
      return NextResponse.json({
        success: false,
        error: `Error de Supabase: ${response.status} - ${errorData}`
      }, { status: 500 });
    }

    const updatedUser = await response.json();
    console.log(`✅ Hash actualizado exitosamente para: ${email}`);
    console.log(`📊 Usuario actualizado:`, updatedUser);

    return NextResponse.json({
      success: true,
      message: `Hash actualizado correctamente para ${email}`,
      user: updatedUser[0] || null
    });

  } catch (error) {
    console.error('❌ Error actualizando hash:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
