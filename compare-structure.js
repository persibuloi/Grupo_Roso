// Script para comparar estructura esperada vs. real en Airtable
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Airtable = require('airtable');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

console.log('🔍 Comparando estructura de datos esperada vs. real...\n');

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

// Estructura que espera el código
const expectedStructure = {
  Categories: {
    fields: ['Name', 'Description', 'Slug', 'Products'],
    required: ['Name']
  },
  Brands: {
    fields: ['Name', 'Description', 'Slug', 'Logo', 'Products'],
    required: ['Name']
  },
  Products: {
    fields: ['Name', 'SKU', 'Description', 'Price Retail', 'Price Wholesale', 'Stock', 'Active', 'Category', 'Brand', 'Images', 'createdTime'],
    required: ['Name', 'Active']
  }
};

async function compareStructure() {
  try {
    for (const [tableName, expectedTable] of Object.entries(expectedStructure)) {
      console.log(`\n📋 Analizando tabla: ${tableName}`);
      console.log(`🎯 Campos esperados: ${expectedTable.fields.join(', ')}`);
      
      try {
        const records = await base(tableName).select({ maxRecords: 1 }).all();
        
        if (records.length === 0) {
          console.log(`⚠️ Tabla ${tableName} está vacía`);
          continue;
        }
        
        const actualFields = Object.keys(records[0].fields);
        console.log(`📄 Campos reales: ${actualFields.join(', ')}`);
        
        // Verificar campos requeridos
        const missingRequired = expectedTable.required.filter(field => !actualFields.includes(field));
        if (missingRequired.length > 0) {
          console.log(`❌ Campos requeridos faltantes: ${missingRequired.join(', ')}`);
        } else {
          console.log(`✅ Todos los campos requeridos están presentes`);
        }
        
        // Verificar campos opcionales faltantes
        const missingOptional = expectedTable.fields.filter(field => 
          !expectedTable.required.includes(field) && !actualFields.includes(field)
        );
        if (missingOptional.length > 0) {
          console.log(`⚠️ Campos opcionales faltantes: ${missingOptional.join(', ')}`);
        }
        
        // Mostrar ejemplo de datos
        console.log(`📄 Ejemplo de registro:`);
        console.log(JSON.stringify(records[0].fields, null, 2));
        
      } catch (error) {
        console.log(`❌ Error accediendo a tabla ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n🎯 Recomendaciones:');
    console.log('1. Asegúrate de que todos los campos requeridos existan');
    console.log('2. Verifica que los nombres de campos coincidan exactamente (case-sensitive)');
    console.log('3. Confirma que las relaciones Category y Brand estén configuradas correctamente');
    console.log('4. Agrega el campo createdTime si falta');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

compareStructure();
