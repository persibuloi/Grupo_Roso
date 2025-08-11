import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  console.log(`🌟 [${timestamp}] API Featured Products - Iniciando solicitud...`);
  
  try {
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY no está definido');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID no está definido');
    }
    
    const tableName = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';
    console.log(`🌟 [${timestamp}] Usando tabla: ${tableName}`);
    
    const Airtable = require('airtable');
    
    console.log(`🌟 [${timestamp}] Configurando Airtable...`);
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    console.log(`🌟 [${timestamp}] Obteniendo registros destacados...`);
    
    // Intentar obtener productos activos (sin filtro de destacado por ahora)
    let records = await base(tableName).select({
      filterByFormula: '{Active}', // Solo productos activos
      maxRecords: 20,
      sort: [{ field: 'createdTime', direction: 'desc' }] // Los más recientes primero
    }).all();
    
    console.log(`🌟 [${timestamp}] Registros activos encontrados: ${records.length}`);
    
    // Filtrar productos destacados en el código si el campo existe
    const featuredRecords = records.filter((record: any) => {
      const fields = record.fields;
      return fields.Destacado === true || fields.Featured === true;
    });
    
    if (featuredRecords.length > 0) {
      console.log(`✨ [${timestamp}] Productos marcados como destacados: ${featuredRecords.length}`);
      records = featuredRecords;
    } else {
      console.log(`⚠️ [${timestamp}] No hay productos destacados, usando productos activos más recientes`);
      records = records.slice(0, 12); // Usar los 12 más recientes
    }

    const slugify = (s: string) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-');
    const toStr = (v: any): string => {
      if (v == null) return '';
      if (Array.isArray(v)) {
        if (v.length > 0) {
          const firstItem = v[0];
          // If it's an object with Name property, extract it
          if (typeof firstItem === 'object' && firstItem.Name) {
            return String(firstItem.Name).trim();
          }
          return String(firstItem).trim();
        }
        return '';
      }
      return String(v).trim();
    };

    // Mapear productos usando exactamente la misma lógica que el endpoint principal
    let products: any[] = records.map((record: any) => {
      const fields = record.fields;
      const categoryName = toStr(fields['Categoria'] ?? fields['Category Name'] ?? fields.Category);
      const brandName = toStr(fields['Marca'] ?? fields['Brand Name'] ?? fields.Brand);
      

      
      return {
        id: record.id,
        name: toStr(fields.Name),
        slug: fields.Name ? slugify(toStr(fields.Name)) : '',
        sku: toStr(fields.SKU),
        description: toStr(fields.Description),
        priceRetail: Number(fields['Price Retail'] ?? 0) || 0,
        priceWholesale: Number(fields['Price Wholesale'] ?? 0) || 0,
        stock: Number(fields.Stock ?? 0) || 0,
        images: Array.isArray(fields.Images) ? fields.Images.map((img: any) => img.url) : [],
        category: categoryName
          ? { id: slugify(categoryName), name: categoryName, slug: slugify(categoryName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        brand: brandName
          ? { id: slugify(brandName), name: brandName, slug: slugify(brandName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        active: fields.Active ?? true,
        createdTime: fields.createdTime || (record as any).createdTime,
        featured: Boolean(fields.Destacado) // Campo destacado
      };
    });

    console.log(`🌟 [${timestamp}] Productos procesados: ${products.length}`);

    if (products.length === 0) {
      console.warn(`⚠️ [${timestamp}] No se encontraron productos para mostrar`);
      return NextResponse.json({ 
        products: [],
        total: 0,
        message: 'No hay productos disponibles para mostrar como destacados'
      });
    }

    // Seleccionar hasta 8 productos de forma aleatoria
    const shuffledProducts = products.sort(() => Math.random() - 0.5);
    const selectedProducts = shuffledProducts.slice(0, 8);

    console.log(`✅ [${timestamp}] Productos destacados enviados: ${selectedProducts.length}`);
    console.log(`✅ [${timestamp}] Nombres: ${selectedProducts.map(p => p.name).join(', ')}`);

    return NextResponse.json({ 
      products: selectedProducts,
      total: selectedProducts.length,
      timestamp: timestamp
    });

  } catch (error) {
    console.error('❌ Error obteniendo productos destacados:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        products: [],
        message: 'No se pudieron cargar los productos destacados'
      },
      { status: 500 }
    );
  }
}
