// Diagnóstico completo del flujo de datos desde la página hasta Airtable
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

console.log('🔍 DIAGNÓSTICO COMPLETO DEL FLUJO DE DATOS\n');

// 1. Verificar variables de entorno
console.log('1️⃣ Variables de entorno:');
console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? `${process.env.AIRTABLE_API_KEY.substring(0, 15)}...` : 'NO ENCONTRADA');
console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'NO ENCONTRADA');
console.log('AIRTABLE_PRODUCTS_TABLE:', process.env.AIRTABLE_PRODUCTS_TABLE || 'NO ENCONTRADA');

// 2. Probar conexión directa a Airtable
console.log('\n2️⃣ Conexión directa a Airtable:');
const Airtable = require('airtable');
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function testDirectConnection() {
  try {
    const records = await base('Products').select({
      filterByFormula: '{Active} = TRUE()',
      maxRecords: 3
    }).all();
    
    console.log(`✅ Conexión exitosa: ${records.length} productos encontrados`);
    
    if (records.length > 0) {
      console.log('📄 Primer producto:');
      console.log(JSON.stringify(records[0].fields, null, 2));
    }
    
    return records;
  } catch (error) {
    console.log(`❌ Error en conexión: ${error.message}`);
    return [];
  }
}

// 3. Simular exactamente lo que hace getFeaturedProducts
async function simulateGetFeaturedProducts() {
  console.log('\n3️⃣ Simulando getFeaturedProducts:');
  
  try {
    // Simular la función getProducts simplificada
    console.log('🛍️ Obteniendo productos de Airtable...');
    
    const selectOptions = {
      filterByFormula: '{Active} = TRUE()',
      maxRecords: 50
    };
    
    const records = await base('Products').select(selectOptions).all();
    console.log(`📦 Registros obtenidos de Airtable: ${records.length}`);
    
    if (records.length === 0) {
      console.log('⚠️ No se encontraron productos activos en Airtable');
      return [];
    }
    
    // Simular formatProduct
    const products = records.map((record) => {
      const fields = record.fields;
      console.log(`🔍 Procesando producto: ${fields.Name || 'Sin nombre'}`);
      
      return {
        id: record.id,
        name: fields.Name || '',
        sku: fields.SKU || '',
        description: fields.Description || '',
        priceRetail: fields['Price Retail'] || 0,
        priceWholesale: fields['Price Wholesale'] || 0,
        stock: fields.Stock || 0,
        active: fields.Active || false,
        createdTime: fields.createdTime || record.createdTime
      };
    });
    
    console.log(`✅ Productos procesados exitosamente: ${products.length}`);
    
    // Simular getFeaturedProducts
    const limit = 8;
    const featuredProducts = products.slice(0, limit);
    console.log(`🎯 getFeaturedProducts devolvería: ${featuredProducts.length} productos`);
    
    return featuredProducts;
    
  } catch (error) {
    console.error('❌ Error en simulación:', error.message);
    return [];
  }
}

// 4. Ejecutar diagnóstico completo
async function runCompleteDiagnosis() {
  const directRecords = await testDirectConnection();
  const simulatedProducts = await simulateGetFeaturedProducts();
  
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log(`- Conexión directa: ${directRecords.length} registros`);
  console.log(`- Simulación getFeaturedProducts: ${simulatedProducts.length} productos`);
  
  if (directRecords.length > 0 && simulatedProducts.length === 0) {
    console.log('❌ PROBLEMA: Los datos existen pero la simulación falla');
  } else if (directRecords.length > 0 && simulatedProducts.length > 0) {
    console.log('✅ TODO FUNCIONA: El problema debe estar en el frontend/Next.js');
  } else {
    console.log('❌ PROBLEMA: No hay datos en Airtable o conexión fallida');
  }
}

runCompleteDiagnosis();
