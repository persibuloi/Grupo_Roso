// Debug script para simular exactamente lo que hace la aplicación
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

console.log('🔍 Simulando el comportamiento exacto de la aplicación...\n');

// Replicar exactamente el código de airtable.ts
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';
const CATEGORIES_TABLE = process.env.AIRTABLE_CATEGORIES_TABLE || 'Categories';
const BRANDS_TABLE = process.env.AIRTABLE_BRANDS_TABLE || 'Brands';
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';

console.log('📋 Variables de entorno:');
console.log('AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? `${AIRTABLE_API_KEY.substring(0, 15)}...` : 'NO ENCONTRADA');
console.log('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID);
console.log('CATEGORIES_TABLE:', CATEGORIES_TABLE);
console.log('BRANDS_TABLE:', BRANDS_TABLE);
console.log('PRODUCTS_TABLE:', PRODUCTS_TABLE);

// Inicializar Airtable exactamente como lo hace el código
let base = null;
if (AIRTABLE_API_KEY) {
  console.log('\n✅ API Key encontrada, inicializando Airtable...');
  Airtable.configure({ apiKey: AIRTABLE_API_KEY });
  base = Airtable.base(AIRTABLE_BASE_ID);
  console.log('✅ Base inicializada:', AIRTABLE_BASE_ID);
} else {
  console.log('\n❌ No se encontró API Key, usará datos mock');
}

// Función para formatear categorías (simplificada)
function formatCategory(record) {
  return {
    id: record.id,
    name: record.fields.Name || '',
    slug: (record.fields.Name || '').toLowerCase().replace(/\s+/g, '-'),
    description: record.fields.Description || ''
  };
}

// Función para formatear marcas (simplificada)
function formatBrand(record) {
  return {
    id: record.id,
    name: record.fields.Name || '',
    slug: (record.fields.Name || '').toLowerCase().replace(/\s+/g, '-'),
    description: record.fields.Description || ''
  };
}

// Función para formatear productos (simplificada)
function formatProduct(record) {
  return {
    id: record.id,
    name: record.fields.Name || '',
    sku: record.fields.SKU || '',
    description: record.fields.Description || '',
    priceRetail: record.fields['Price Retail'] || 0,
    priceWholesale: record.fields['Price Wholesale'] || 0,
    stock: record.fields.Stock || 0,
    active: record.fields.Active || false
  };
}

// Simular las funciones exactas de la aplicación
async function testGetCategories() {
  console.log('\n📂 Probando getCategories()...');
  
  if (!base) {
    console.log('❌ No hay base, devolvería datos mock');
    return [];
  }
  
  try {
    const records = await base(CATEGORIES_TABLE).select().all();
    const categories = records.map(formatCategory);
    console.log(`✅ Categorías obtenidas: ${categories.length}`);
    categories.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`));
    return categories;
  } catch (error) {
    console.log('❌ Error en getCategories:', error.message);
    console.log('   Devolvería datos mock');
    return [];
  }
}

async function testGetBrands() {
  console.log('\n🏭 Probando getBrands()...');
  
  if (!base) {
    console.log('❌ No hay base, devolvería datos mock');
    return [];
  }
  
  try {
    const records = await base(BRANDS_TABLE).select().all();
    const brands = records.map(formatBrand);
    console.log(`✅ Marcas obtenidas: ${brands.length}`);
    brands.forEach(brand => console.log(`   - ${brand.name} (${brand.slug})`));
    return brands;
  } catch (error) {
    console.log('❌ Error en getBrands:', error.message);
    console.log('   Devolvería datos mock');
    return [];
  }
}

async function testGetProducts() {
  console.log('\n🛍️ Probando getProducts()...');
  
  if (!base) {
    console.log('❌ No hay base, devolvería datos mock');
    return [];
  }
  
  try {
    const records = await base(PRODUCTS_TABLE).select({ maxRecords: 10 }).all();
    const products = records.map(formatProduct);
    console.log(`✅ Productos obtenidos: ${products.length}`);
    products.forEach(product => console.log(`   - ${product.name} (${product.sku}) - $${product.priceRetail}`));
    return products;
  } catch (error) {
    console.log('❌ Error en getProducts:', error.message);
    console.log('   Devolvería datos mock');
    return [];
  }
}

async function runFullTest() {
  const categories = await testGetCategories();
  const brands = await testGetBrands();
  const products = await testGetProducts();
  
  console.log('\n📊 Resumen:');
  console.log(`Categorías: ${categories.length}`);
  console.log(`Marcas: ${brands.length}`);
  console.log(`Productos: ${products.length}`);
  
  if (categories.length === 0 && brands.length === 0 && products.length === 0) {
    console.log('\n❌ La aplicación usaría datos MOCK porque no pudo obtener datos reales');
  } else {
    console.log('\n✅ La aplicación debería usar datos REALES de Airtable');
  }
}

runFullTest();
