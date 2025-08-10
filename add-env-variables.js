// Script para agregar variables de entorno faltantes para NextAuth.js
const fs = require('fs');
const path = require('path');

function addMissingEnvVariables() {
  console.log('🔧 Agregando variables de entorno faltantes para NextAuth.js\n');
  
  const envPath = path.join(__dirname, '.env.local');
  
  // Variables que necesitamos agregar
  const newVariables = `
# Tablas de administración
AIRTABLE_USERS_TABLE=Users
AIRTABLE_ROLES_TABLE=Roles
AIRTABLE_SESSIONS_TABLE=User Sessions
AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log

# NextAuth.js
NEXTAUTH_SECRET=grupo_roso_secret_2024_cambiar_en_produccion
NEXTAUTH_URL=http://localhost:3001
`;

  try {
    // Leer el archivo actual
    let currentContent = '';
    if (fs.existsSync(envPath)) {
      currentContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Archivo .env.local encontrado');
    } else {
      console.log('⚠️  Archivo .env.local no encontrado, se creará uno nuevo');
    }
    
    // Verificar qué variables ya existen
    const existingVars = [
      'AIRTABLE_USERS_TABLE',
      'AIRTABLE_ROLES_TABLE', 
      'AIRTABLE_SESSIONS_TABLE',
      'AIRTABLE_ACTIVITY_LOG_TABLE',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];
    
    const missingVars = existingVars.filter(varName => 
      !currentContent.includes(varName + '=')
    );
    
    if (missingVars.length === 0) {
      console.log('✅ Todas las variables ya están configuradas');
      return;
    }
    
    console.log(`🔄 Agregando ${missingVars.length} variables faltantes:`);
    missingVars.forEach(varName => console.log(`   • ${varName}`));
    
    // Agregar las nuevas variables
    const updatedContent = currentContent + newVariables;
    
    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('\n✅ Variables agregadas exitosamente a .env.local');
    console.log('\n📋 Variables agregadas:');
    console.log('AIRTABLE_USERS_TABLE=Users');
    console.log('AIRTABLE_ROLES_TABLE=Roles');
    console.log('AIRTABLE_SESSIONS_TABLE=User Sessions');
    console.log('AIRTABLE_ACTIVITY_LOG_TABLE=Activity Log');
    console.log('NEXTAUTH_SECRET=grupo_roso_secret_2024_cambiar_en_produccion');
    console.log('NEXTAUTH_URL=http://localhost:3001');
    
    console.log('\n🔄 IMPORTANTE: Reinicia el servidor para aplicar los cambios:');
    console.log('   Ctrl+C para detener el servidor actual');
    console.log('   pnpm dev para reiniciar');
    
  } catch (error) {
    console.error('❌ Error agregando variables:', error.message);
  }
}

// Ejecutar
addMissingEnvVariables();
