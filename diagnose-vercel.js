// Script de diagnóstico para verificar la API de productos
// Ejecutar con: node diagnose-vercel.js

const https = require('https');
const http = require('http');

async function testAPI(url) {
  console.log(`🔍 Probando: ${url}`);
  
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`✅ Products count: ${json.count || 0}`);
          console.log(`✅ Success: ${json.success}`);
          if (json.error) {
            console.log(`❌ Error: ${json.error}`);
          }
          resolve({ success: true, data: json, status: res.statusCode });
        } catch (e) {
          console.log(`❌ JSON Parse Error: ${e.message}`);
          console.log(`❌ Raw response: ${data.substring(0, 200)}...`);
          resolve({ success: false, error: e.message, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`❌ Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('🚀 Diagnóstico de API Grupo Roso\n');
  
  // Test local
  console.log('--- LOCAL ---');
  await testAPI('http://localhost:3000/api/products');
  
  console.log('\n--- VERCEL ---');
  await testAPI('https://grupo-roso.vercel.app/api/products');
}

main().catch(console.error);
