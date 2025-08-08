// Test directo de la función getProducts actual
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

console.log('🎯 Test directo de getProducts actual...\n');

// Simular exactamente lo que hace getProducts ahora
const Airtable = require('airtable');
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testCurrentGetProducts() {
  try {
    console.log('🛍️ Obteniendo productos SOLO de tabla Products...');
    
    const records = await base(PRODUCTS_TABLE).select({
      filterByFormula: '{Active} = TRUE()',
      maxRecords: 50
    }).all();
    
    console.log(`📦 Registros obtenidos: ${records.length}`);
    
    if (records.length === 0) {
      console.log('❌ NO HAY REGISTROS - Verificar filtro Active = TRUE()');
      
      // Probar sin filtro
      console.log('\n🔍 Probando SIN filtro...');
      const allRecords = await base(PRODUCTS_TABLE).select({ maxRecords: 10 }).all();
      console.log(`📦 Total registros sin filtro: ${allRecords.length}`);
      
      if (allRecords.length > 0) {
        console.log('📄 Primer registro:');
        console.log(JSON.stringify(allRecords[0].fields, null, 2));
      }
      
      return [];
    }
    
    const products = records.map((record) => {
      const fields = record.fields;
      console.log(`🔍 Procesando: ${fields.Name}`);
      
      return {
        id: record.id,
        name: fields.Name || '',
        sku: fields.SKU || '',
        priceRetail: fields['Price Retail'] || 0,
        stock: fields.Stock || 0,
        active: fields.Active || false
      };
    });
    
    console.log(`✅ Productos procesados: ${products.length}`);
    return products;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

testCurrentGetProducts();
