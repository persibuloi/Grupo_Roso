// Script para actualizar NEXTAUTH_URL al puerto correcto
const fs = require('fs');
const path = require('path');

function updateNextAuthUrl() {
  console.log('🔧 Actualizando NEXTAUTH_URL al puerto correcto\n');
  
  const envPath = path.join(__dirname, '.env.local');
  
  try {
    // Leer el archivo actual
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Reemplazar la URL del puerto 3001 por 3002
    const oldUrl = 'NEXTAUTH_URL=http://localhost:3001';
    const newUrl = 'NEXTAUTH_URL=http://localhost:3002';
    
    if (content.includes(oldUrl)) {
      content = content.replace(oldUrl, newUrl);
      
      // Escribir el archivo actualizado
      fs.writeFileSync(envPath, content);
      
      console.log('✅ NEXTAUTH_URL actualizado exitosamente');
      console.log(`   Anterior: http://localhost:3001`);
      console.log(`   Nuevo: http://localhost:3002`);
      
      console.log('\n🔄 Reinicia el servidor para aplicar el cambio:');
      console.log('   Ctrl+C para detener');
      console.log('   pnpm dev para reiniciar');
    } else {
      console.log('⚠️  NEXTAUTH_URL ya está configurado correctamente o no se encontró');
    }
    
  } catch (error) {
    console.error('❌ Error actualizando NEXTAUTH_URL:', error.message);
  }
}

// Ejecutar
updateNextAuthUrl();
