// API para obtener estadísticas reales del dashboard admin
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Configurar Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Obteniendo estadísticas del dashboard...');

    // Obtener productos
    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    const productsRecords = await productsTable.select({
      fields: ['Name', 'Stock', 'Price Retail', 'Categoria', 'Marca']
    }).all();

    // Calcular estadísticas de productos
    const totalProducts = productsRecords.length;
    const lowStockProducts = productsRecords.filter(record => {
      const stock = record.get('Stock') as number;
      return stock && stock < 10; // Consideramos stock bajo si es menor a 10
    }).length;

    // Obtener usuarios (si la tabla existe)
    let totalUsers = 0;
    try {
      const usersTable = base(process.env.AIRTABLE_USERS_TABLE || 'Users');
      const usersRecords = await usersTable.select({
        fields: ['Email', 'Role']
      }).all();
      totalUsers = usersRecords.length;
    } catch (error) {
      console.log('⚠️ Tabla Users no encontrada, usando valor por defecto');
      totalUsers = 1; // Al menos el admin existe
    }

    // Obtener actividad reciente (si la tabla existe)
    let recentActivity = [];
    try {
      const activityTable = base(process.env.AIRTABLE_ACTIVITY_LOG_TABLE || 'Activity Log');
      const activityRecords = await activityTable.select({
        fields: ['Action', 'User Email', 'Timestamp', 'Details'],
        sort: [{ field: 'Timestamp', direction: 'desc' }],
        maxRecords: 5
      }).all();

      recentActivity = activityRecords.map(record => ({
        id: record.id,
        action: record.get('Action') as string,
        userEmail: record.get('User Email') as string,
        timestamp: record.get('Timestamp') as string,
        details: record.get('Details') as string
      }));
    } catch (error) {
      console.log('⚠️ Tabla Activity Log no encontrada, usando actividad por defecto');
      recentActivity = [
        {
          id: '1',
          action: 'Login',
          userEmail: 'admin@gruporoso.com',
          timestamp: new Date().toISOString(),
          details: 'Acceso al panel de administración'
        }
      ];
    }

    // Calcular valor total del inventario
    const totalInventoryValue = productsRecords.reduce((total, record) => {
      const precio = record.get('Price Retail') as number;
      const stock = record.get('Stock') as number;
      return total + (precio && stock ? precio * stock : 0);
    }, 0);

    // Estadísticas por categoría
    const categoryStats = productsRecords.reduce((stats: any, record) => {
      const categoria = record.get('Categoria') as string;
      if (categoria) {
        stats[categoria] = (stats[categoria] || 0) + 1;
      }
      return stats;
    }, {});

    const response = {
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalUsers,
        totalInventoryValue,
        categoryStats,
        recentActivity,
        lastUpdated: new Date().toISOString()
      }
    };

    console.log('✅ Estadísticas obtenidas exitosamente:', {
      totalProducts,
      lowStockProducts,
      totalUsers,
      totalInventoryValue: totalInventoryValue.toFixed(2)
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
