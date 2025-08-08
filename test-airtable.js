// Test script para verificar conexión con Airtable
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';
const CATEGORIES_TABLE = process.env.AIRTABLE_CATEGORIES_TABLE || 'Categories';
const BRANDS_TABLE = process.env.AIRTABLE_BRANDS_TABLE || 'Brands';
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';

console.log('🔍 Verificando configuración de Airtable...\n');
console.log('API Key:', AIRTABLE_API_KEY ? `${AIRTABLE_API_KEY.substring(0, 10)}...` : 'NO CONFIGURADA');
console.log('Base ID:', AIRTABLE_BASE_ID);
console.log('Tabla Categorías:', CATEGORIES_TABLE);
console.log('Tabla Marcas:', BRANDS_TABLE);
console.log('Tabla Productos:', PRODUCTS_TABLE);
console.log('\n' + '='.repeat(50) + '\n');

if (!AIRTABLE_API_KEY) {
  console.error('❌ Error: AIRTABLE_API_KEY no está configurada');
  process.exit(1);
}

// Configurar Airtable
Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

async function testConnection() {
  try {
    console.log('🧪 Probando conexión con Airtable...\n');

    // Test 1: Verificar tabla Categories
    console.log('📂 Probando tabla Categories...');
    try {
      const categories = await base(CATEGORIES_TABLE).select({ maxRecords: 3 }).all();
      console.log(`✅ Categories: ${categories.length} registros encontrados`);
      if (categories.length > 0) {
        console.log('   Ejemplo:', categories[0].fields);
      }
    } catch (error) {
      console.log(`❌ Error en Categories: ${error.message}`);
    }

    console.log('');

    // Test 2: Verificar tabla Brands
    console.log('🏭 Probando tabla Brands...');
    try {
      const brands = await base(BRANDS_TABLE).select({ maxRecords: 3 }).all();
      console.log(`✅ Brands: ${brands.length} registros encontrados`);
      if (brands.length > 0) {
        console.log('   Ejemplo:', brands[0].fields);
      }
    } catch (error) {
      console.log(`❌ Error en Brands: ${error.message}`);
    }

    console.log('');

    // Test 3: Verificar tabla Products
    console.log('🛍️ Probando tabla Products...');
    try {
      const products = await base(PRODUCTS_TABLE).select({ maxRecords: 3 }).all();
      console.log(`✅ Products: ${products.length} registros encontrados`);
      if (products.length > 0) {
        console.log('   Ejemplo:', products[0].fields);
      }
    } catch (error) {
      console.log(`❌ Error en Products: ${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Prueba de conexión completada!');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

testConnection();
