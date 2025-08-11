import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Hardcoded Supabase config for testing
const SUPABASE_URL = 'https://usnwpiauncxiumwuhzru.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbndwaWF1bmN4aXVtd3VoenJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgwMzYzNiwiZXhwIjoyMDY2Mzc5NjM2fQ.NUQoTlec7UziEZb_CjM0vF261qcs-3_hjkV8PBrlHJ8';

// Hash password with salt
function hashPassword(password: string): string {
  const salt = 'grupo-rosso-2024';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Simple login attempt started');
    
    const { email, password } = await request.json();
    console.log('📧 Email:', email);

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email y contraseña son requeridos'
      }, { status: 400 });
    }

    // Hash the provided password
    const hashedPassword = hashPassword(password);
    console.log('🔐 Password hash:', hashedPassword);

    // Query Supabase for user
    console.log('🔍 Querying Supabase...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}&password_hash=eq.${hashedPassword}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Supabase response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Supabase error:', response.status, errorText);
      return NextResponse.json({
        success: false,
        error: 'Error de conexión con la base de datos'
      }, { status: 500 });
    }

    const users = await response.json();
    console.log('👥 Users found:', users.length);

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales incorrectas'
      }, { status: 401 });
    }

    const user = users[0];
    console.log('✅ Login successful for:', user.email, 'Role:', user.role);

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
    console.error('💥 Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
