const Airtable = require('airtable');

const AIRTABLE_API_KEY = 'patMDZDfquaNFn8TW.c52a58678cabdff455813a52816eca773b909233a22c8e4caba519a695e1a1d0';
const AIRTABLE_BASE_ID = 'appPDMVHaoYx7wL9P'; // Base ID correcto

console.log('🔍 Probando conexión con Base ID correcto...\n');
console.log('Base ID:', AIRTABLE_BASE_ID);

// Configurar Airtable
Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testCorrectBase() {
  try {
    console.log('📂 Probando tabla Categories...');
    const categories = await base('Categories').select({ maxRecords: 5 }).all();
    console.log(`✅ Categories encontradas: ${categories.length}`);
    
    if (categories.length > 0) {
      console.log('Ejemplo de categoría:', categories[0].fields);
      console.log('Campos disponibles:', Object.keys(categories[0].fields));
    }
    
    console.log('\n🏭 Probando tabla Brands...');
    const brands = await base('Brands').select({ maxRecords: 5 }).all();
    console.log(`✅ Brands encontradas: ${brands.length}`);
    
    if (brands.length > 0) {
      console.log('Ejemplo de marca:', brands[0].fields);
      console.log('Campos disponibles:', Object.keys(brands[0].fields));
    }
    
    console.log('\n🛍️ Probando tabla Products...');
    const products = await base('Products').select({ maxRecords: 5 }).all();
    console.log(`✅ Products encontrados: ${products.length}`);
    
    if (products.length > 0) {
      console.log('Ejemplo de producto:', products[0].fields);
      console.log('Campos disponibles:', Object.keys(products[0].fields));
    }
    
    console.log('\n🎉 ¡Conexión exitosa con Airtable!');
    console.log(`📊 Total: ${categories.length} categorías, ${brands.length} marcas, ${products.length} productos`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode) {
      console.error('Código de estado:', error.statusCode);
    }
  }
}

testCorrectBase();
