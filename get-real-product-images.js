require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

console.log('🖼️ Obteniendo URLs REALES de cada producto desde Airtable...');

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
  
  console.log('🎯 CÓDIGO PARA ACTUALIZAR CATÁLOGO:\n');
  
  records.forEach((record, index) => {
    const fields = record.fields;
    console.log(`// PRODUCTO ${index + 1}: ${fields.Name}`);
    console.log(`{`);
    console.log(`  id: '${record.id}',`);
    console.log(`  name: '${fields.Name}',`);
    console.log(`  slug: '${fields.Name.toLowerCase().replace(/\s+/g, '-')}',`);
    console.log(`  sku: '${fields.SKU}',`);
    console.log(`  description: '${fields.Description || 'Producto de alta calidad'}',`);
    console.log(`  priceRetail: ${fields['Price Retail'] || 0},`);
    console.log(`  priceWholesale: ${fields['Price Wholesale'] || 0},`);
    console.log(`  stock: ${fields.Stock || 0},`);
    console.log(`  category: { id: 'cat${index + 1}', name: 'General', slug: 'general', description: '' },`);
    console.log(`  brand: { id: 'brand${index + 1}', name: 'General', slug: 'general', description: '' },`);
    
    // Obtener URL real de imagen
    if (fields.Images && fields.Images.length > 0) {
      console.log(`  images: ['${fields.Images[0].url}'],`);
    } else {
      console.log(`  images: ['/images/placeholder-product.jpg'],`);
    }
    
    console.log(`  active: true,`);
    console.log(`  createdTime: new Date().toISOString()`);
    console.log(`},`);
    console.log('');
  });
});
