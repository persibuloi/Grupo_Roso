// Debug script para verificar datos de filtros
const Airtable = require('airtable');
require('dotenv').config({ path: '.env.local' });

// Configurar Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function debugFilters() {
  try {
    console.log('🔍 Iniciando debug de filtros...');
    console.log('🔍 API Key:', process.env.AIRTABLE_API_KEY ? 'Configurada' : 'NO CONFIGURADA');
    console.log('🔍 Base ID:', process.env.AIRTABLE_BASE_ID);
    console.log('🔍 Table:', process.env.AIRTABLE_PRODUCTS_TABLE);

    const productsTable = base('Products'); // Tabla correcta de productos
    
    const records = await productsTable.select({
      fields: [
        'Name', 
        'SKU', 
        'Categoria', 
        'Marca'
      ],
      maxRecords: 3 // Solo los primeros 3 para debug
    }).all();

    console.log('🔍 Total records encontrados:', records.length);

    // Solo revisar el primer record para debug
    if (records.length > 0) {
      const fields = records[0].fields;
      console.log('🔍 PRIMER PRODUCTO:');
      console.log('Name:', fields.Name);
      console.log('Categoria crudo:', fields.Categoria);
      console.log('Marca crudo:', fields.Marca);
      
      const categoryProcessed = toStr(fields.Categoria);
      const brandProcessed = toStr(fields.Marca);
      console.log('Categoria procesada:', categoryProcessed);
      console.log('Marca procesada:', brandProcessed);
    }

    // Generar arrays de filtros como en el frontend
    const categories = [...new Set(records.map(record => {
      const categoryName = toStr(record.fields.Categoria);
      console.log('🔍 Extrayendo categoría:', categoryName);
      return categoryName;
    }).filter(Boolean))];

    const brands = [...new Set(records.map(record => {
      const brandName = toStr(record.fields.Marca);
      console.log('🔍 Extrayendo marca:', brandName);
      return brandName;
    }).filter(Boolean))];

    console.log('\n🔍 RESULTADO FINAL:');
    console.log('  - Categorías únicas:', categories);
    console.log('  - Marcas únicas:', brands);
    console.log('  - Total categorías:', categories.length);
    console.log('  - Total marcas:', brands.length);

  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
}

// Función toStr igual que en la API
function toStr(v) {
  if (v == null) return '';
  if (Array.isArray(v)) {
    if (v.length > 0) {
      const firstItem = v[0];
      if (typeof firstItem === 'object' && firstItem.Name) {
        return String(firstItem.Name).trim();
      }
      return String(firstItem).trim();
    }
    return '';
  }
  return String(v).trim();
}

debugFilters();
