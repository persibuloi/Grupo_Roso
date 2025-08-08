require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

console.log('🖼️ Obteniendo URLs REALES de imágenes desde Airtable...');

Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base('appPDMVHaoYx7wL9P');

base('Products').select({ 
  maxRecords: 10,
  filterByFormula: '{Active} = TRUE()'
}).firstPage((err, records) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  
  console.log(`📋 Productos activos encontrados: ${records.length}\n`);
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`🛍️ PRODUCTO ${index + 1}: ${fields.Name}`);
    console.log(`📝 SKU: ${fields.SKU}`);
    
    // Verificar campo Images
    if (fields.Images) {
      console.log(`🖼️ Tiene imágenes: SÍ (${fields.Images.length} imágenes)`);
      fields.Images.forEach((img, imgIndex) => {
        console.log(`   📸 Imagen ${imgIndex + 1}: ${img.url}`);
        console.log(`   📏 Tamaño: ${img.width}x${img.height}`);
        console.log(`   📁 Archivo: ${img.filename}`);
      });
    } else {
      console.log(`🖼️ Tiene imágenes: NO`);
    }
    console.log('---');
  });
  
  // Generar código para copiar y pegar
  console.log('\n🎯 CÓDIGO PARA COPIAR (URLs reales):');
  records.forEach((record, index) => {
    const fields = record.fields;
    if (fields.Images && fields.Images.length > 0) {
      console.log(`// ${fields.Name}`);
      console.log(`images: ['${fields.Images[0].url}'],`);
    } else {
      console.log(`// ${fields.Name} - Sin imagen`);
      console.log(`images: ['/images/placeholder-product.jpg'],`);
    }
  });
});
