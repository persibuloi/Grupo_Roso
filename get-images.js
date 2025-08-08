require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

console.log('🖼️ Obteniendo URLs reales de imágenes desde Airtable...');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ maxRecords: 10 }).firstPage((err, records) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  
  console.log(`📋 Productos encontrados: ${records.length}`);
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`\n🛍️ PRODUCTO ${index + 1}:`);
    console.log(`📝 Nombre: ${fields.Name}`);
    console.log(`📝 SKU: ${fields.SKU}`);
    console.log(`🖼️ Campo Images:`, fields.Images);
    console.log(`🖼️ Tipo Images:`, typeof fields.Images);
    console.log(`🖼️ Es array?:`, Array.isArray(fields.Images));
    
    if (fields.Images && Array.isArray(fields.Images) && fields.Images.length > 0) {
      console.log(`🖼️ Cantidad de imágenes: ${fields.Images.length}`);
      fields.Images.forEach((img, imgIndex) => {
        console.log(`   📸 Imagen ${imgIndex + 1}:`, img.url);
      });
    } else {
      console.log(`❌ Sin imágenes en este producto`);
    }
  });
});
