// Script para descubrir los nombres reales de los campos en Airtable
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function discoverFields() {
  console.log('🔍 Descubriendo nombres reales de campos en Airtable\n');
  
  try {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Obtener un registro de Products sin especificar campos
    console.log('--- TABLA PRODUCTS ---');
    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE);
    const productsRecords = await productsTable.select({
      maxRecords: 1
    }).all();
    
    if (productsRecords.length > 0) {
      const record = productsRecords[0];
      console.log('✅ Campos disponibles en Products:');
      
      // Obtener todos los campos del registro
      const fields = record.fields;
      Object.keys(fields).forEach(fieldName => {
        const value = fields[fieldName];
        const type = typeof value;
        const displayValue = type === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
        console.log(`   • ${fieldName}: ${displayValue} (${type})`);
      });
    } else {
      console.log('❌ No se encontraron registros en Products');
    }
    
    // Verificar tabla Users
    console.log('\n--- TABLA USERS ---');
    try {
      const usersTable = base(process.env.AIRTABLE_USERS_TABLE);
      const usersRecords = await usersTable.select({
        maxRecords: 1
      }).all();
      
      if (usersRecords.length > 0) {
        const record = usersRecords[0];
        console.log('✅ Campos disponibles en Users:');
        
        const fields = record.fields;
        Object.keys(fields).forEach(fieldName => {
          const value = fields[fieldName];
          const type = typeof value;
          // Ocultar contraseñas por seguridad
          const displayValue = fieldName.toLowerCase().includes('password') 
            ? '[OCULTO]' 
            : (type === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value);
          console.log(`   • ${fieldName}: ${displayValue} (${type})`);
        });
      } else {
        console.log('❌ No se encontraron registros en Users');
      }
    } catch (error) {
      console.log(`⚠️ Error accediendo a Users: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar
discoverFields();
