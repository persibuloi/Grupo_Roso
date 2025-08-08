require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function getRealProducts() {
  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
  const base = Airtable.base('appPDMVHaoYx7wL9P');
  
  try {
    const records = await base('Products').select({
      filterByFormula: '{Active} = TRUE()',
      maxRecords: 20
    }).all();
    
    console.log('// PRODUCTOS REALES PARA COPIAR AL CÓDIGO:');
    console.log('const realProducts = [');
    
    records.forEach((record, index) => {
      const fields = record.fields;
      const imageUrl = fields.Images && fields.Images.length > 0 ? fields.Images[0].url : '/images/placeholder-product.jpg';
      
      console.log(`  {`);
      console.log(`    id: '${record.id}',`);
      console.log(`    name: '${fields.Name || ''}',`);
      console.log(`    slug: '${fields.Name ? fields.Name.toLowerCase().replace(/\s+/g, '-') : ''}',`);
      console.log(`    sku: '${fields.SKU || ''}',`);
      console.log(`    description: '${fields.Description || 'Producto de alta calidad'}',`);
      console.log(`    priceRetail: ${fields['Price Retail'] || 0},`);
      console.log(`    priceWholesale: ${fields['Price Wholesale'] || 0},`);
      console.log(`    stock: ${fields.Stock || 0},`);
      console.log(`    category: { id: 'default', name: 'General', slug: 'general', description: '' },`);
      console.log(`    brand: { id: 'default', name: 'General', slug: 'general', description: '' },`);
      console.log(`    images: ['${imageUrl}'],`);
      console.log(`    active: true,`);
      console.log(`    createdTime: '${new Date().toISOString()}'`);
      console.log(`  }${index < records.length - 1 ? ',' : ''}`);
    });
    
    console.log('];');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

getRealProducts();
