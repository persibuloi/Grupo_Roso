// Test simple para verificar la API de admin/products
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Probando API /api/admin/products...');
    
    const response = await fetch('http://localhost:3000/api/admin/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Nota: Esta prueba fallará por autenticación, pero nos dará info
      }
    });
    
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    
    if (response.status === 401) {
      console.log('✅ API responde correctamente (401 = requiere autenticación)');
      console.log('🔍 Esto confirma que la API está funcionando');
    } else {
      const data = await response.json();
      console.log('📦 Datos recibidos:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
