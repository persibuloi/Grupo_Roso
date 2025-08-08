require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

console.log('🔍 Verificando campos disponibles en Airtable...');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ maxRecords: 1 }).firstPage((err, records) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  
  if (records.length > 0) {
    const record = records[0];
    console.log('📋 TODOS LOS CAMPOS DISPONIBLES:');
    console.log('📋 Campos:', Object.keys(record.fields));
    console.log('\n📋 DETALLES DE CADA CAMPO:');
    
    Object.keys(record.fields).forEach(fieldName => {
      const value = record.fields[fieldName];
      console.log(`📋 ${fieldName}:`, typeof value, Array.isArray(value) ? `(array con ${value.length} elementos)` : '');
      
      // Si es un array, mostrar el primer elemento para ver la estructura
      if (Array.isArray(value) && value.length > 0) {
        console.log(`   📸 Primer elemento:`, value[0]);
      }
    });
  } else {
    console.log('❌ No se encontraron registros');
  }
});
