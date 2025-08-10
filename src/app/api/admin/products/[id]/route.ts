// API para gestión de productos individuales
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Airtable from 'airtable';

// Configurar Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

// GET - Obtener producto específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session || !['Admin', 'Vendedor', 'Distribuidor'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado'
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;
    console.log('🔍 Obteniendo producto:', productId);

    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    const record = await productsTable.find(productId);

    const product = {
      id: record.id,
      name: record.get('Name') as string,
      sku: record.get('SKU') as string,
      description: record.get('Description') as string,
      priceRetail: record.get('Price Retail') as number,
      priceWholesale: record.get('Price Wholesale') as number,
      stock: record.get('Stock') as number,
      category: record.get('Categoria') as string,
      brand: record.get('Marca') as string,
      active: record.get('Active') as boolean,
      createdTime: record.get('createdTime') as string
    };

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Producto no encontrado',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 404 });
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions);
    if (!session || !['Admin', 'Vendedor'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado - Solo administradores y vendedores pueden editar productos'
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;
    const body = await request.json();
    const { name, sku, description, priceRetail, priceWholesale, stock, active } = body;

    console.log('✏️ Actualizando producto:', productId);

    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    
    // Preparar campos a actualizar
    const fieldsToUpdate: any = {};
    
    if (name !== undefined) fieldsToUpdate['Name'] = name;
    if (sku !== undefined) fieldsToUpdate['SKU'] = sku;
    if (description !== undefined) fieldsToUpdate['Description'] = description;
    if (priceRetail !== undefined) fieldsToUpdate['Price Retail'] = priceRetail;
    if (priceWholesale !== undefined) fieldsToUpdate['Price Wholesale'] = priceWholesale;
    if (stock !== undefined) fieldsToUpdate['Stock'] = stock;
    if (active !== undefined) fieldsToUpdate['Active'] = active;

    const updatedRecord = await productsTable.update([
      {
        id: productId,
        fields: fieldsToUpdate
      }
    ]);

    console.log('✅ Producto actualizado exitosamente:', productId);

    // Registrar actividad
    try {
      const activityTable = base(process.env.AIRTABLE_ACTIVITY_LOG_TABLE || 'Activity Log');
      await activityTable.create([
        {
          fields: {
            'Action': 'Product Updated',
            'User Email': session.user.email,
            'Timestamp': new Date().toISOString(),
            'Details': `Producto actualizado: ${name || 'ID ' + productId}`
          }
        }
      ]);
    } catch (activityError) {
      console.log('⚠️ Error registrando actividad:', activityError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedRecord[0].id,
        message: 'Producto actualizado exitosamente'
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// DELETE - Desactivar producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions);
    if (!session || !['Admin'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado - Solo administradores pueden eliminar productos'
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;
    console.log('🗑️ Desactivando producto:', productId);

    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    
    // Soft delete - marcar como inactivo
    const updatedRecord = await productsTable.update([
      {
        id: productId,
        fields: {
          'Active': false
        }
      }
    ]);

    console.log('✅ Producto desactivado exitosamente:', productId);

    // Registrar actividad
    try {
      const activityTable = base(process.env.AIRTABLE_ACTIVITY_LOG_TABLE || 'Activity Log');
      await activityTable.create([
        {
          fields: {
            'Action': 'Product Deactivated',
            'User Email': session.user.email,
            'Timestamp': new Date().toISOString(),
            'Details': `Producto desactivado: ID ${productId}`
          }
        }
      ]);
    } catch (activityError) {
      console.log('⚠️ Error registrando actividad:', activityError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedRecord[0].id,
        message: 'Producto desactivado exitosamente'
      }
    });

  } catch (error) {
    console.error('❌ Error desactivando producto:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
