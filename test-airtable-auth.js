// Test completo de autenticación y permisos de Airtable
const https = require('https');

// Simular el mismo código que usa la API de Vercel
async function testAirtableDirectly() {
  console.log('🔍 Probando Airtable directamente con las mismas credenciales...\n');
  
  // Estas deberían ser las mismas variables que tienes en Vercel
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  
  if (!AIRTABLE_API_KEY) {
    console.log('❌ AIRTABLE_API_KEY no está definido en .env.local');
    return;
  }
  
  if (!AIRTABLE_BASE_ID) {
    console.log('❌ AIRTABLE_BASE_ID no está definido en .env.local');
    return;
  }
  
  console.log(`🔑 API Key: ${AIRTABLE_API_KEY.substring(0, 10)}...`);
  console.log(`🗂️  Base ID: ${AIRTABLE_BASE_ID}`);
  
  // Test directo a la API de Airtable (igual que hace nuestro código)
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Products?maxRecords=3`;
  
  console.log(`\n🌐 URL: ${url}`);
  
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📊 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log(`✅ Éxito! Registros encontrados: ${json.records?.length || 0}`);
            if (json.records && json.records.length > 0) {
              console.log(`📝 Primer producto: ${json.records[0].fields.Name || 'Sin nombre'}`);
            }
          } else {
            console.log(`❌ Error ${res.statusCode}:`);
            console.log(json);
          }
          
          resolve(json);
        } catch (e) {
          console.log(`❌ Error parsing JSON: ${e.message}`);
          console.log(`📄 Raw response: ${data}`);
          resolve({ error: 'Parse error', raw: data });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Request error: ${err.message}`);
      resolve({ error: err.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`❌ Timeout`);
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function testWithAirtableLibrary() {
  console.log('\n🔍 Probando con la librería Airtable (como en el código)...\n');
  
  try {
    const Airtable = require('airtable');
    
    Airtable.configure({ 
      apiKey: process.env.AIRTABLE_API_KEY 
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    console.log('📡 Obteniendo registros...');
    
    const records = await base('Products').select({
      maxRecords: 3
    }).all();
    
    console.log(`✅ Éxito! Registros obtenidos: ${records.length}`);
    
    if (records.length > 0) {
      console.log(`📝 Primer producto: ${records[0].fields.Name || 'Sin nombre'}`);
      console.log(`📝 Campos disponibles:`, Object.keys(records[0].fields));
    }
    
  } catch (error) {
    console.log(`❌ Error con librería Airtable: ${error.message}`);
    console.log(`📄 Error completo:`, error);
  }
}

async function main() {
  console.log('🚀 Test completo de autenticación Airtable\n');
  
  await testAirtableDirectly();
  await testWithAirtableLibrary();
}

main().catch(console.error);
