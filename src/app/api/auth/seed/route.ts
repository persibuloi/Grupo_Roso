import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Hash password with salt
function hashPassword(password: string): string {
  const salt = 'grupo-rosso-2024';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Configuración de Supabase no encontrada'
      }, { status: 500 });
    }

    // Create test users for all roles
    const testUsers = [
      {
        email: 'admin@test.com',
        name: 'Administrador',
        password: hashPassword('admin123'),
        role: 'admin',
        active: true
      },
      {
        email: 'vendedor@test.com',
        name: 'Juan Vendedor',
        password: hashPassword('vendedor123'),
        role: 'vendedor',
        active: true
      },
      {
        email: 'distribuidor@test.com',
        name: 'María Distribuidora',
        password: hashPassword('distribuidor123'),
        role: 'distribuidor',
        active: true
      }
    ];

    console.log('🌱 Creando usuarios de prueba para todos los roles...');

    const createdUsers = [];
    const existingUsers = [];

    for (const user of testUsers) {
      // Check if user already exists
      const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${user.email}&select=*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!checkResponse.ok) {
        throw new Error(`Error checking existing user ${user.email}: ${checkResponse.status}`);
      }

      const existing = await checkResponse.json();

      if (existing.length > 0) {
        existingUsers.push({
          email: user.email,
          name: user.name,
          role: user.role
        });
        console.log(`⚠️ Usuario ${user.email} ya existe`);
        continue;
      }

      // Create the user
      const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Supabase error for ${user.email}:`, response.status, errorText);
        throw new Error(`Error creating user ${user.email}: ${response.status}`);
      }

      const createdUser = await response.json();
      createdUsers.push({
        id: createdUser[0]?.id,
        email: createdUser[0]?.email,
        name: createdUser[0]?.name,
        role: createdUser[0]?.role
      });
      console.log(`✅ Usuario ${user.email} creado exitosamente`);
    }

    return NextResponse.json({
      success: true,
      message: `Proceso completado. Creados: ${createdUsers.length}, Ya existían: ${existingUsers.length}`,
      created: createdUsers,
      existing: existingUsers,
      credentials: [
        { email: 'admin@test.com', password: 'admin123', role: 'admin' },
        { email: 'vendedor@test.com', password: 'vendedor123', role: 'vendedor' },
        { email: 'distribuidor@test.com', password: 'distribuidor123', role: 'distribuidor' }
      ]
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 });
  }
}
