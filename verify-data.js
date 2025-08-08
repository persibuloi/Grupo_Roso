// Script para verificar qué datos está usando la aplicación
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

console.log('🔍 Verificando variables de entorno cargadas...\n');
console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? `${process.env.AIRTABLE_API_KEY.substring(0, 15)}...` : 'NO ENCONTRADA');
console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID || 'NO ENCONTRADA');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NO ENCONTRADA');

// Simular lo que hace el código de airtable.ts
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';

console.log('\n📋 Configuración que usaría el código:');
console.log('Base ID final:', AIRTABLE_BASE_ID);
console.log('¿Tiene API Key?:', !!AIRTABLE_API_KEY);

if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID === 'appPDMVHaoYx7wL9P') {
  console.log('\n✅ ¡Configuración correcta! Debería usar datos reales de Airtable.');
} else {
  console.log('\n❌ Configuración incorrecta. Usará datos mock.');
  if (!AIRTABLE_API_KEY) console.log('   - Falta API Key');
  if (AIRTABLE_BASE_ID !== 'appPDMVHaoYx7wL9P') console.log('   - Base ID incorrecto:', AIRTABLE_BASE_ID);
}
