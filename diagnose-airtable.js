const Airtable = require('airtable');

const AIRTABLE_API_KEY = 'patMDZDfquaNFn8TW.c52a58678cabdff455813a52816eca773b909233a22c8e4caba519a695e1a1d0';

console.log('🔍 Diagnóstico detallado de Airtable...\n');

// Configurar Airtable
Airtable.configure({ apiKey: AIRTABLE_API_KEY });

async function testDifferentBases() {
  const basesToTest = [
    'app4xBwfGa1IwoCkr', // Base ID actual
    // Agregar otros Base IDs si los tienes
  ];
  
  for (const baseId of basesToTest) {
    console.log(`\n📋 Probando Base ID: ${baseId}`);
    const base = Airtable.base(baseId);
    
    // Probar diferentes nombres de tablas
    const tablesToTest = [
      'Categories',
      'Category', 
      'categories',
      'Categorias',
      'Brands',
      'Brand',
      'brands',
      'Marcas',
      'Products',
      'Product',
      'products',
      'Productos'
    ];
    
    for (const tableName of tablesToTest) {
      try {
        console.log(`  🔍 Probando tabla: "${tableName}"`);
        const records = await base(tableName).select({ maxRecords: 1 }).all();
        console.log(`  ✅ ¡Tabla "${tableName}" encontrada! (${records.length} registros)`);
        
        if (records.length > 0) {
          console.log(`  📄 Campos disponibles:`, Object.keys(records[0].fields));
        }
        
        // Si encontramos una tabla, no necesitamos probar más variaciones
        break;
        
      } catch (error) {
        if (error.statusCode === 404) {
          console.log(`  ❌ Tabla "${tableName}" no existe`);
        } else if (error.statusCode === 403) {
          console.log(`  🚫 Sin permisos para tabla "${tableName}"`);
        } else {
          console.log(`  ⚠️ Error en tabla "${tableName}": ${error.message}`);
        }
      }
    }
  }
}

async function testAPIKey() {
  try {
    console.log('🔑 Probando validez de API key...');
    
    // Intentar acceder a cualquier base para verificar la API key
    const testBase = Airtable.base('appXXXXXXXXXXXXXX'); // Base ID inválido a propósito
    await testBase('TestTable').select({ maxRecords: 1 }).all();
    
  } catch (error) {
    if (error.statusCode === 401) {
      console.log('❌ API key inválida');
    } else if (error.statusCode === 403) {
      console.log('✅ API key válida (error 403 esperado con base inválida)');
    } else if (error.statusCode === 404) {
      console.log('✅ API key válida (error 404 esperado con base inválida)');
    } else {
      console.log('⚠️ Error inesperado:', error.message);
    }
  }
}

async function runDiagnosis() {
  await testAPIKey();
  await testDifferentBases();
  console.log('\n🏁 Diagnóstico completado.');
}

runDiagnosis();
