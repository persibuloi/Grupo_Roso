// Diagnóstico de configuración NextAuth.js
require('dotenv').config({ path: '.env.local' });

function diagnoseNextAuth() {
  console.log('🔍 Diagnóstico de configuración NextAuth.js\n');
  
  // Variables requeridas para NextAuth
  const requiredVars = {
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
    'AIRTABLE_API_KEY': process.env.AIRTABLE_API_KEY,
    'AIRTABLE_BASE_ID': process.env.AIRTABLE_BASE_ID,
    'AIRTABLE_USERS_TABLE': process.env.AIRTABLE_USERS_TABLE,
    'AIRTABLE_ACTIVITY_LOG_TABLE': process.env.AIRTABLE_ACTIVITY_LOG_TABLE
  };
  
  console.log('--- VARIABLES DE ENTORNO ---');
  let hasErrors = false;
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.log(`❌ ${key}: NO DEFINIDO`);
      hasErrors = true;
    } else {
      // Mostrar solo los primeros caracteres por seguridad
      const displayValue = key.includes('SECRET') || key.includes('API_KEY') 
        ? value.substring(0, 10) + '...' 
        : value;
      console.log(`✅ ${key}: ${displayValue}`);
    }
  });
  
  if (hasErrors) {
    console.log('\n--- VARIABLES FALTANTES ---');
    console.log('Agrega estas variables a tu .env.local:');
    console.log('');
    
    if (!process.env.NEXTAUTH_SECRET) {
      console.log('NEXTAUTH_SECRET=grupo_roso_secret_2024_cambiar_en_produccion');
    }
    
    if (!process.env.NEXTAUTH_URL) {
      console.log('NEXTAUTH_URL=http://localhost:3001');
    }
    
    if (!process.env.AIRTABLE_USERS_TABLE) {
      console.log('AIRTABLE_USERS_TABLE=Users');
    }
    
    if (!process.env.AIRTABLE_ACTIVITY_LOG_TABLE) {
      console.log('AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log');
    }
    
    console.log('\n💡 Después de agregar las variables, reinicia el servidor con: pnpm dev');
    return false;
  }
  
  console.log('\n--- CONFIGURACIÓN NEXTAUTH ---');
  console.log('✅ Todas las variables están configuradas');
  
  // Verificar que el puerto coincida
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl && !nextAuthUrl.includes('3001')) {
    console.log('⚠️  NEXTAUTH_URL usa puerto diferente al servidor (3001)');
    console.log(`   Actual: ${nextAuthUrl}`);
    console.log('   Sugerido: http://localhost:3001');
  }
  
  return true;
}

// Ejecutar diagnóstico
const isConfigured = diagnoseNextAuth();

if (isConfigured) {
  console.log('\n🎉 Configuración NextAuth.js correcta');
  console.log('Si aún hay errores, verifica:');
  console.log('1. Que el servidor esté reiniciado');
  console.log('2. Que la tabla Users exista en Airtable');
  console.log('3. Que el usuario admin esté creado');
}
