// Script detallado para diagnosticar el error 500 en Vercel
const https = require('https');

async function getDetailedError(url) {
  console.log(`🔍 Obteniendo detalles del error: ${url}`);
  
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📊 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Response Length: ${data.length} bytes`);
        console.log(`📊 Raw Response:`);
        console.log(data);
        
        try {
          const json = JSON.parse(data);
          console.log(`📊 Parsed JSON:`, json);
          resolve(json);
        } catch (e) {
          console.log(`❌ No es JSON válido`);
          resolve({ error: 'Invalid JSON', raw: data });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({ error: err.message });
    });
    
    req.setTimeout(15000, () => {
      console.log(`❌ Timeout después de 15 segundos`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('🚀 Diagnóstico detallado del error 500\n');
  
  await getDetailedError('https://grupo-roso.vercel.app/api/products');
}

main().catch(console.error);
