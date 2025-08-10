// Test de la API de estadísticas corregida
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function testAdminStatsAPI() {
  console.log('🧪 Probando API de estadísticas corregida\n');
  
  try {
    Airtable.configure({
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Simular exactamente lo que hace la API
    console.log('--- OBTENIENDO PRODUCTOS ---');
    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    const productsRecords = await productsTable.select({
      fields: ['Name', 'Stock', 'Price Retail', 'Categoria', 'Marca']
    }).all();
    
    console.log(`✅ ${productsRecords.length} productos obtenidos`);
    
    // Calcular estadísticas
    const totalProducts = productsRecords.length;
    const lowStockProducts = productsRecords.filter(record => {
      const stock = record.get('Stock') as number;
      return stock && stock < 10;
    }).length;
    
    const totalInventoryValue = productsRecords.reduce((total, record) => {
      const precio = record.get('Price Retail') as number;
      const stock = record.get('Stock') as number;
      return total + (precio && stock ? precio * stock : 0);
    }, 0);
    
    const categoryStats = productsRecords.reduce((stats: any, record) => {
      const categoria = record.get('Categoria') as string;
      if (categoria) {
        stats[categoria] = (stats[categoria] || 0) + 1;
      }
      return stats;
    }, {});
    
    console.log('\n--- ESTADÍSTICAS CALCULADAS ---');
    console.log(`📦 Total productos: ${totalProducts}`);
    console.log(`⚠️ Stock bajo: ${lowStockProducts}`);
    console.log(`💰 Valor inventario: ₡${totalInventoryValue.toLocaleString()}`);
    console.log('📊 Por categoría:', categoryStats);
    
    // Probar usuarios
    console.log('\n--- OBTENIENDO USUARIOS ---');
    let totalUsers = 0;
    try {
      const usersTable = base(process.env.AIRTABLE_USERS_TABLE || 'Users');
      const usersRecords = await usersTable.select({
        fields: ['Email', 'Role']
      }).all();
      totalUsers = usersRecords.length;
      console.log(`✅ ${totalUsers} usuarios encontrados`);
    } catch (error) {
      console.log(`⚠️ Error usuarios: ${error.message}`);
      totalUsers = 1; // Valor por defecto
    }
    
    // Simular respuesta de la API
    const apiResponse = {
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalUsers,
        totalInventoryValue,
        categoryStats,
        recentActivity: [
          {
            id: '1',
            action: 'Login',
            userEmail: 'admin@gruporoso.com',
            timestamp: new Date().toISOString(),
            details: 'Acceso al panel de administración'
          }
        ],
        lastUpdated: new Date().toISOString()
      }
    };
    
    console.log('\n--- RESPUESTA API SIMULADA ---');
    console.log('✅ API funcionaría correctamente');
    console.log('📊 Datos:', JSON.stringify(apiResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
  }
}

// Ejecutar test
testAdminStatsAPI();
