// Test en tiempo real para verificar qué está pasando exactamente
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

console.log('🔍 Test en tiempo real de la conexión con Airtable...\n');

// Usar exactamente las mismas variables que la aplicación
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';

console.log('📋 Configuración actual:');
console.log('API Key:', AIRTABLE_API_KEY ? `${AIRTABLE_API_KEY.substring(0, 15)}...` : 'NO ENCONTRADA');
console.log('Base ID:', AIRTABLE_BASE_ID);
console.log('¿Base inicializada?', !!AIRTABLE_API_KEY);

if (!AIRTABLE_API_KEY) {
  console.log('\n❌ PROBLEMA: No se encontró AIRTABLE_API_KEY');
  console.log('La aplicación devolvería arrays vacíos');
  process.exit(1);
}

// Inicializar exactamente como lo hace la aplicación
Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testLiveConnection() {
  console.log('\n🧪 Probando conexión en tiempo real...\n');

  try {
    // Test 1: Categorías
    console.log('📂 Probando categorías...');
    const categoriesRecords = await base('Categories').select().all();
    console.log(`✅ Categorías encontradas: ${categoriesRecords.length}`);
    if (categoriesRecords.length > 0) {
      console.log('Primera categoría:', categoriesRecords[0].fields);
    }

    // Test 2: Marcas
    console.log('\n🏭 Probando marcas...');
    const brandsRecords = await base('Brands').select().all();
    console.log(`✅ Marcas encontradas: ${brandsRecords.length}`);
    if (brandsRecords.length > 0) {
      console.log('Primera marca:', brandsRecords[0].fields);
    }

    // Test 3: Productos
    console.log('\n🛍️ Probando productos...');
    const productsRecords = await base('Products').select({ maxRecords: 10 }).all();
    console.log(`✅ Productos encontrados: ${productsRecords.length}`);
    
    if (productsRecords.length > 0) {
      console.log('Primer producto:', productsRecords[0].fields);
      console.log('Campos disponibles:', Object.keys(productsRecords[0].fields));
      
      // Verificar campos específicos que necesita la aplicación
      const firstProduct = productsRecords[0].fields;
      console.log('\n🔍 Verificación de campos requeridos:');
      console.log('- Name:', firstProduct.Name || 'FALTA');
      console.log('- SKU:', firstProduct.SKU || 'FALTA');
      console.log('- Price Retail:', firstProduct['Price Retail'] || 'FALTA');
      console.log('- Price Wholesale:', firstProduct['Price Wholesale'] || 'FALTA');
      console.log('- Stock:', firstProduct.Stock || 'FALTA');
      console.log('- Active:', firstProduct.Active || 'FALTA');
      console.log('- Category:', firstProduct.Category || 'FALTA');
      console.log('- Brand:', firstProduct.Brand || 'FALTA');
    }

    console.log('\n🎯 Resumen:');
    console.log(`Total: ${categoriesRecords.length} categorías, ${brandsRecords.length} marcas, ${productsRecords.length} productos`);
    
    if (productsRecords.length === 0) {
      console.log('\n❌ PROBLEMA: No se encontraron productos en Airtable');
      console.log('La aplicación mostraría un catálogo vacío');
    } else {
      console.log('\n✅ Los datos están disponibles en Airtable');
      console.log('El problema debe estar en el código de la aplicación');
    }

  } catch (error) {
    console.error('\n❌ Error en la conexión:', error.message);
    if (error.statusCode) {
      console.error('Código de estado:', error.statusCode);
    }
    console.log('La aplicación devolvería arrays vacíos');
  }
}

testLiveConnection();
