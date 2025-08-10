// Diagnóstico de problemas de autenticación en catálogos
const fetch = require('node-fetch');

async function diagnoseAuthIssue() {
  console.log('🔍 Diagnóstico de problemas de autenticación\n');
  
  try {
    // Probar la API de productos sin autenticación
    console.log('--- PROBANDO API SIN AUTENTICACIÓN ---');
    const response = await fetch('http://localhost:3003/api/admin/products');
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 401) {
      console.log('\n✅ La API está correctamente protegida (401 sin auth)');
      console.log('El problema está en el frontend - la sesión no se está enviando correctamente');
      
      console.log('\n--- POSIBLES CAUSAS ---');
      console.log('1. NextAuth session no está disponible en el cliente');
      console.log('2. Las cookies de sesión no se están enviando');
      console.log('3. El middleware de autenticación no está funcionando');
      console.log('4. Problema con getServerSession en la API');
      
      console.log('\n--- SOLUCIONES SUGERIDAS ---');
      console.log('1. Verificar que SessionProvider esté correctamente configurado');
      console.log('2. Revisar que las cookies de NextAuth se estén enviando');
      console.log('3. Verificar configuración de NEXTAUTH_URL');
      console.log('4. Revisar importación de authOptions en la API');
      
    } else if (response.status === 500) {
      console.log('\n❌ Error interno del servidor');
      console.log('Revisar logs del servidor para más detalles');
      
    } else {
      console.log('\n⚠️ Respuesta inesperada');
      console.log('La API no está protegida correctamente o hay otro problema');
    }
    
  } catch (error) {
    console.error('❌ Error conectando con la API:', error.message);
    console.log('\n--- VERIFICAR ---');
    console.log('1. Que el servidor esté corriendo en puerto 3003');
    console.log('2. Que la ruta /api/admin/products exista');
    console.log('3. Que no haya errores de compilación');
  }
}

// Ejecutar diagnóstico
diagnoseAuthIssue();
