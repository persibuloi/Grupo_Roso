// Test final para getFeaturedProducts - exactamente lo que usa la página principal
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Importar las funciones exactas que usa la aplicación
async function testFeaturedProducts() {
  try {
    console.log('🎯 Test final - getFeaturedProducts...\n');
    
    // Simular exactamente lo que hace la aplicación
    const { getFeaturedProducts } = require('./src/lib/airtable.ts');
    
    console.log('📞 Llamando a getFeaturedProducts(8)...');
    const featuredProducts = await getFeaturedProducts(8);
    
    console.log(`📊 Resultado: ${featuredProducts.length} productos destacados`);
    
    if (featuredProducts.length > 0) {
      console.log('\n✅ Productos encontrados:');
      featuredProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.priceRetail} (Stock: ${product.stock})`);
      });
    } else {
      console.log('\n❌ No se encontraron productos destacados');
      console.log('La página principal mostrará un catálogo vacío');
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFeaturedProducts();
