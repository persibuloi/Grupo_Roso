require('dotenv').config({ path: '.env.local' });

// Importar la función getProducts
const { getProducts } = require('./src/lib/airtable.ts');

async function testGetProducts() {
  console.log('🧪 Probando función getProducts...');
  
  try {
    const products = await getProducts({});
    console.log(`✅ Productos obtenidos: ${products.length}`);
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Imágenes: ${product.images.length}`);
      if (product.images.length > 0) {
        console.log(`   Primera imagen: ${product.images[0]}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getProducts:', error.message);
  }
}

testGetProducts();
