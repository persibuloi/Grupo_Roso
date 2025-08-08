// Test específico solo para productos
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';

console.log('🛍️ Test específico de productos...\n');
console.log('Base ID:', AIRTABLE_BASE_ID);

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testProductsSpecific() {
  try {
    console.log('📋 Probando productos sin filtros...');
    const allRecords = await base('Products').select().all();
    console.log(`Total productos en Airtable: ${allRecords.length}`);
    
    if (allRecords.length > 0) {
      console.log('\n📄 Primer producto completo:');
      console.log('ID:', allRecords[0].id);
      console.log('Campos:', allRecords[0].fields);
      
      console.log('\n🔍 Verificando campos específicos:');
      const fields = allRecords[0].fields;
      console.log('- Name:', fields.Name || 'FALTA');
      console.log('- Active:', fields.Active);
      console.log('- createdTime:', fields.createdTime || 'FALTA');
      console.log('- Stock:', fields.Stock);
    }
    
    console.log('\n🔍 Probando con filtro Active = true...');
    const activeRecords = await base('Products').select({
      filterByFormula: '{Active} = 1'
    }).all();
    console.log(`Productos activos: ${activeRecords.length}`);
    
    console.log('\n🔍 Probando sin filtros de ordenamiento...');
    const simpleRecords = await base('Products').select({
      maxRecords: 5
    }).all();
    console.log(`Productos (máximo 5): ${simpleRecords.length}`);
    
    if (simpleRecords.length > 0) {
      console.log('\nPrimeros productos:');
      simpleRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.fields.Name || 'Sin nombre'} (Active: ${record.fields.Active})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode) {
      console.error('Código:', error.statusCode);
    }
  }
}

testProductsSpecific();
