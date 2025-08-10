// Diagnóstico de la API de estadísticas del admin
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function diagnoseAdminStats() {
  console.log('🔍 Diagnóstico de API /api/admin/stats\n');
  
  // Verificar variables de entorno
  console.log('--- VARIABLES DE ENTORNO ---');
  const requiredVars = {
    'AIRTABLE_API_KEY': process.env.AIRTABLE_API_KEY,
    'AIRTABLE_BASE_ID': process.env.AIRTABLE_BASE_ID,
    'AIRTABLE_PRODUCTS_TABLE': process.env.AIRTABLE_PRODUCTS_TABLE,
    'AIRTABLE_USERS_TABLE': process.env.AIRTABLE_USERS_TABLE,
    'AIRTABLE_ACTIVITY_LOG_TABLE': process.env.AIRTABLE_ACTIVITY_LOG_TABLE
  };
  
  let hasEnvErrors = false;
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      console.log(`❌ ${key}: NO DEFINIDO`);
      hasEnvErrors = true;
    } else {
      const displayValue = key.includes('API_KEY') 
        ? value.substring(0, 10) + '...' 
        : value;
      console.log(`✅ ${key}: ${displayValue}`);
    }
  });
  
  if (hasEnvErrors) {
    console.log('\n❌ Faltan variables de entorno críticas');
    return;
  }
  
  // Configurar Airtable
  try {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    console.log('\n✅ Airtable configurado correctamente');
    
    // Probar conexión con tabla Products
    console.log('\n--- PROBANDO TABLA PRODUCTS ---');
    try {
      const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE);
      const productsRecords = await productsTable.select({
        fields: ['Nombre', 'Stock', 'Precio', 'Categoria', 'Marca'],
        maxRecords: 3
      }).all();
      
      console.log(`✅ Tabla Products: ${productsRecords.length} registros encontrados`);
      
      if (productsRecords.length > 0) {
        const sample = productsRecords[0];
        console.log('   Ejemplo:', {
          nombre: sample.get('Nombre'),
          stock: sample.get('Stock'),
          precio: sample.get('Precio'),
          categoria: sample.get('Categoria'),
          marca: sample.get('Marca')
        });
      }
      
    } catch (error) {
      console.log(`❌ Error en tabla Products: ${error.message}`);
      console.log('   Posibles causas:');
      console.log('   - Nombre de tabla incorrecto');
      console.log('   - Permisos insuficientes del token');
      console.log('   - Campos no existen en la tabla');
    }
    
    // Probar conexión con tabla Users
    console.log('\n--- PROBANDO TABLA USERS ---');
    try {
      const usersTable = base(process.env.AIRTABLE_USERS_TABLE);
      const usersRecords = await usersTable.select({
        fields: ['Email', 'Role'],
        maxRecords: 3
      }).all();
      
      console.log(`✅ Tabla Users: ${usersRecords.length} registros encontrados`);
      
    } catch (error) {
      console.log(`⚠️ Tabla Users no accesible: ${error.message}`);
      console.log('   Esto es normal si la tabla no existe aún');
    }
    
    // Probar conexión con tabla Activity Log
    console.log('\n--- PROBANDO TABLA ACTIVITY LOG ---');
    try {
      const activityTable = base(process.env.AIRTABLE_ACTIVITY_LOG_TABLE);
      const activityRecords = await activityTable.select({
        fields: ['Action', 'User Email', 'Timestamp', 'Details'],
        maxRecords: 3
      }).all();
      
      console.log(`✅ Tabla Activity Log: ${activityRecords.length} registros encontrados`);
      
    } catch (error) {
      console.log(`⚠️ Tabla Activity Log no accesible: ${error.message}`);
      console.log('   Esto es normal si la tabla no existe aún');
    }
    
  } catch (error) {
    console.log(`❌ Error configurando Airtable: ${error.message}`);
    console.log('   Verifica:');
    console.log('   - API Key válido');
    console.log('   - Base ID correcto');
    console.log('   - Permisos del token');
  }
}

// Ejecutar diagnóstico
diagnoseAdminStats().catch(error => {
  console.error('❌ Error en diagnóstico:', error);
});
