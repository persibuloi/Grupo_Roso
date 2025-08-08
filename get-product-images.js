require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

console.log('🖼️ Obteniendo URLs REALES de cada producto desde Airtable...');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ 
  filterByFormula: '{Active} = TRUE()',
  maxRecords: 10
}).firstPage((err, records) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  
  console.log(`📋 Productos activos: ${records.length}\n`);
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`PRODUCTO ${index + 1}:`);
    console.log(`Nombre: ${fields.Name}`);
    console.log(`SKU: ${fields.SKU}`);
    
    if (fields.Images && fields.Images.length > 0) {
      console.log(`URL IMAGEN: ${fields.Images[0].url}`);
    } else {
      console.log(`SIN IMAGEN - usar placeholder`);
    }
    console.log('---\n');
  });
});
