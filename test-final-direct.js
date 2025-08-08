// Test final de la solución directa
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

console.log('🎯 TEST FINAL - Solución directa...\n');

// Configurar Airtable con API key del entorno
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });

async function testDirectSolution() {
  try {
    console.log('🔍 Probando conexión directa exactamente como el código...');
    
    // Usar exactamente los mismos valores que el código
    const directBase = Airtable.base('appPDMVHaoYx7wL9P');
    
    const records = await directBase('Products').select({
      maxRecords: 10
    }).all();
    
    console.log(`📦 Registros obtenidos DIRECTAMENTE: ${records.length}`);
    
    if (records.length === 0) {
      console.log('❌ NO HAY REGISTROS - La solución directa no funciona');
      return false;
    }
    
    console.log('✅ PRODUCTOS ENCONTRADOS:');
    records.forEach((record, index) => {
      const fields = record.fields;
      console.log(`${index + 1}. ${fields.Name} - $${fields['Price Retail']} (Stock: ${fields.Stock})`);
    });
    
    console.log('\n🎉 LA SOLUCIÓN DIRECTA FUNCIONA CORRECTAMENTE');
    console.log('Si los productos no aparecen en el frontend, el problema está en Next.js/React');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en solución directa:', error.message);
    return false;
  }
}

testDirectSolution();
