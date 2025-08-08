// Test simple - solo tabla Products
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🎯 Test simple - Solo tabla Products...\n');

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testProductsOnly() {
  try {
    console.log('📦 Obteniendo productos directamente...');
    
    const records = await base('Products').select({
      filterByFormula: '{Active} = TRUE()',
      maxRecords: 5
    }).all();
    
    console.log(`✅ Encontrados ${records.length} productos activos\n`);
    
    if (records.length > 0) {
      console.log('📋 Estructura de campos en Products:');
      const firstRecord = records[0];
      const fields = Object.keys(firstRecord.fields);
      console.log(`Campos disponibles: ${fields.join(', ')}\n`);
      
      console.log('📄 Ejemplo de producto:');
      console.log(JSON.stringify(firstRecord.fields, null, 2));
      
      console.log('\n🎯 Productos encontrados:');
      records.forEach((record, index) => {
        const fields = record.fields;
        console.log(`${index + 1}. ${fields.Name || 'Sin nombre'}`);
        console.log(`   - Precio: ${fields['Price Retail'] || 'N/A'}`);
        console.log(`   - Stock: ${fields.Stock || 'N/A'}`);
        console.log(`   - Activo: ${fields.Active || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron productos activos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProductsOnly();
