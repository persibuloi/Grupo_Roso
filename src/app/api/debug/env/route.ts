import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    env_check: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'CONFIGURADO' : 'NO ENCONTRADO',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'CONFIGURADO' : 'NO ENCONTRADO',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'CONFIGURADO' : 'NO ENCONTRADO',
      NODE_ENV: process.env.NODE_ENV || 'NO DEFINIDO'
    },
    values: {
      SUPABASE_URL: process.env.SUPABASE_URL || 'undefined',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'eyJ...[OCULTO]' : 'undefined',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'eyJ...[OCULTO]' : 'undefined'
    }
  });
}
