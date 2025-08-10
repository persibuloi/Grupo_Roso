// API para gestión de productos en el panel admin
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import Airtable from 'airtable';

// Configurar Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);

// GET - Obtener todos los productos para administración
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    console.log('🔍 Verificando sesión:', session ? 'Sesión encontrada' : 'Sin sesión');
    console.log('🔍 Usuario:', session?.user?.email);
    console.log('🔍 Rol:', session?.user?.role);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'No autenticado - Inicia sesión'
      }, { status: 401 });
    }
    
    if (!['Admin', 'Vendedor', 'Distribuidor'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: `No autorizado - Rol ${session.user.role} no tiene permisos`
      }, { status: 403 });
    }

    console.log('🔍 Obteniendo productos para administración...');

    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    const records = await productsTable.select({
      fields: [
        'Name', 
        'SKU', 
        'Description', 
        'Price Retail', 
        'Price Wholesale', 
        'Stock', 
        'Categoria', 
        'Marca', 
        'Active',
        'Images',
        'createdTime'
      ],
      sort: [{ field: 'createdTime', direction: 'desc' }]
    }).all();

    // Helper functions (optimized for LOOKUP fields with objects)
    const slugify = (s: string) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-');
    const toStr = (v: any): string => {
      if (v == null) return '';
      if (Array.isArray(v)) {
        // For LOOKUP fields that return objects, extract the Name property
        if (v.length > 0) {
          const firstItem = v[0];
          // If it's an object with Name property, extract it
          if (typeof firstItem === 'object' && firstItem.Name) {
            return String(firstItem.Name).trim();
          }
          // Otherwise, convert to string directly
          return String(firstItem).trim();
        }
        return '';
      }
      return String(v).trim();
    };

    const products = records.map((record, index) => {
      const fields = record.fields;
      
      // Extract LOOKUP field values (Categoria and Marca point to other tables)
      const categoryName = toStr(fields['Categoria']);
      const brandName = toStr(fields['Marca']);

      // Obtener la URL de la imagen
      const imagesField = record.get('Images');
      let imageUrl = '';
      if (imagesField && Array.isArray(imagesField) && imagesField.length > 0) {
        imageUrl = imagesField[0].url || '';
      }

      return {
        id: record.id,
        name: toStr(fields.Name),
        description: toStr(fields.Description),
        sku: toStr(fields.SKU),
        priceRetail: Number(fields['Price Retail'] ?? 0) || 0,
        priceWholesale: Number(fields['Price Wholesale'] ?? 0) || 0,
        stock: Number(fields.Stock ?? 0) || 0,
        // Map category and brand as objects (same as main catalog)
        category: categoryName
          ? { id: slugify(categoryName), name: categoryName, slug: slugify(categoryName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        brand: brandName
          ? { id: slugify(brandName), name: brandName, slug: slugify(brandName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        active: fields.Active ?? true,
        image: imageUrl,
        createdTime: fields.createdTime || record.createdTime,
        // Calcular estado del stock
        stockStatus: (() => {
          const stock = Number(fields.Stock ?? 0) || 0;
          if (!stock || stock === 0) return 'out_of_stock';
          if (stock < 5) return 'critical';
          if (stock < 10) return 'low';
          return 'normal';
        })()
      };
    });

    console.log(`✅ ${products.length} productos obtenidos para administración`);
    
    // DEBUG: Verificar estructura de los primeros productos
    if (products.length > 0) {
      console.log('🔍 DEBUG API - Primer producto completo:', JSON.stringify(products[0], null, 2));
      console.log('🔍 DEBUG API - Category del primer producto:', products[0].category);
      console.log('🔍 DEBUG API - Brand del primer producto:', products[0].brand);
    }
    
    // DEBUG: Verificar categorías y marcas únicas
    const debugCategories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
    const debugBrands = [...new Set(products.map(p => p.brand?.name).filter(Boolean))];
    console.log('🔍 DEBUG API - Categorías únicas:', debugCategories);
    console.log('🔍 DEBUG API - Marcas únicas:', debugBrands);

    return NextResponse.json({
      success: true,
      data: {
        products,
        total: products.length,
        lowStock: products.filter(p => p.stockStatus === 'low' || p.stockStatus === 'critical').length,
        outOfStock: products.filter(p => p.stockStatus === 'out_of_stock').length
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions);
    if (!session || !['Admin'].includes(session.user.role)) {
      return NextResponse.json({
        success: false,
        error: 'No autorizado - Solo administradores pueden crear productos'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, sku, description, priceRetail, priceWholesale, stock, category, brand } = body;

    // Validaciones básicas
    if (!name || !sku || !priceRetail) {
      return NextResponse.json({
        success: false,
        error: 'Campos requeridos: name, sku, priceRetail'
      }, { status: 400 });
    }

    console.log('➕ Creando nuevo producto:', name);

    const productsTable = base(process.env.AIRTABLE_PRODUCTS_TABLE || 'Products');
    
    const newRecord = await productsTable.create([
      {
        fields: {
          'Name': name,
          'SKU': sku,
          'Description': description || '',
          'Price Retail': priceRetail,
          'Price Wholesale': priceWholesale || priceRetail,
          'Stock': stock || 0,
          'Active': true
          // Nota: Categoria y Marca son campos lookup, se manejan por separado
        }
      }
    ]);

    console.log('✅ Producto creado exitosamente:', newRecord[0].id);

    return NextResponse.json({
      success: true,
      data: {
        id: newRecord[0].id,
        message: 'Producto creado exitosamente'
      }
    });

  } catch (error) {
    console.error('❌ Error creando producto:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
