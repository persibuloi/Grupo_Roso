// Test simple de Airtable
require('dotenv').config({ path: '.env.local' });

async function simpleTest() {
  console.log('🔍 Test simple de Airtable\n');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  console.log('Variables de entorno:');
  console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NO DEFINIDO'}`);
  console.log(`Base ID: ${baseId || 'NO DEFINIDO'}`);
  
  if (!apiKey || !baseId) {
    console.log('\n❌ Variables de entorno faltantes');
    return;
  }
  
  try {
    const Airtable = require('airtable');
    Airtable.configure({ apiKey });
    const base = Airtable.base(baseId);
    
    console.log('\n📡 Intentando obtener 1 registro...');
    
    const records = await base('Products').select({
      maxRecords: 1
    }).all();
    
    console.log(`✅ Éxito! Registros: ${records.length}`);
    
    if (records.length > 0) {
      console.log('📝 Campos del primer registro:');
      console.log(Object.keys(records[0].fields));
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    
    if (error.message.includes('NOT_FOUND')) {
      console.log('💡 Posible causa: La tabla "Products" no existe o tiene otro nombre');
    } else if (error.message.includes('AUTHENTICATION_REQUIRED')) {
      console.log('💡 Posible causa: API Key inválido');
    } else if (error.message.includes('FORBIDDEN')) {
      console.log('💡 Posible causa: Sin permisos para acceder a esta base');
    }
  }
}

simpleTest();
