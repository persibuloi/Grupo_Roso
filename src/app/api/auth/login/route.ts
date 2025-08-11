import { NextRequest, NextResponse } from 'next/server';

// Configuración hardcodeada para evitar problemas con variables de entorno
const SUPABASE_URL = 'https://usnwpiauncxiumwuhzru.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgwMzYzNiwiZXhwIjoyMDY2Mzc5NjM2fQ.NUQoTlec7UziEZb_CjM0vF261qcs-3_hjkV8PBrlHJ8';

// Hash password with salt - MISMO SALT que la herramienta de actualización
async function hashPassword(password: string): Promise<string> {
  const salt = 'grupo_rosso_salt_2024';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Iniciando proceso de login...');
    
    const { email, password } = await request.json();
    console.log(`📧 Email recibido: ${email}`);

    if (!email || !password) {
      console.log('❌ Faltan credenciales');
      return NextResponse.json({
        success: false,
        error: 'Email y contraseña son requeridos'
      }, { status: 400 });
    }

    // Hash the provided password con el MISMO algoritmo que la herramienta
    console.log('🔑 Generando hash de contraseña...');
    const hashedPassword = await hashPassword(password);
    console.log(`🔑 Hash generado: ${hashedPassword.substring(0, 20)}...`);

    // Query Supabase for user - CORREGIDO: password_hash en lugar de password
    console.log('🔍 Buscando usuario en Supabase...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}&password_hash=eq.${hashedPassword}&active=eq.true&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('❌ Error de Supabase:', response.status, response.statusText);
      return NextResponse.json({
        success: false,
        error: 'Error de conexión con la base de datos'
      }, { status: 500 });
    }

    const users = await response.json();
    console.log(`📊 Usuarios encontrados: ${users.length}`);

    if (users.length === 0) {
      console.log('❌ No se encontró usuario con esas credenciales');
      return NextResponse.json({
        success: false,
        error: 'Credenciales incorrectas'
      }, { status: 401 });
    }

    const user = users[0];
    console.log(`✅ Usuario encontrado: ${user.email} (${user.role})`);

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
