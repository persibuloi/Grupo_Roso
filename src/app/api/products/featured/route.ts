import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('🌟 API Featured Products - Obteniendo productos destacados...');
  
  try {
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY no está definido');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID no está definido');
    }
    
    const Airtable = require('airtable');
    
    console.log('🌟 API Featured Products - Configurando Airtable...');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    console.log('🌟 API Featured Products - Obteniendo registros destacados...');
    const records = await base('Products').select({
      filterByFormula: 'AND({Active}, {Destacado})', // Filtrar solo productos activos Y destacados
      maxRecords: 100
    }).all();
    
    console.log(`🌟 Registros obtenidos: ${records.length}`);

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

    console.log(`🌟 Productos destacados encontrados: ${products.length}`);

    if (products.length === 0) {
      return NextResponse.json({ 
        products: [],
        total: 0,
        message: 'No hay productos marcados como destacados'
      });
    }

    // Seleccionar hasta 8 productos de forma aleatoria
    const shuffledProducts = products.sort(() => Math.random() - 0.5);
    const selectedProducts = shuffledProducts.slice(0, 8);

    console.log(`🌟 Productos destacados seleccionados: ${selectedProducts.length}`);

    return NextResponse.json({ 
      products: selectedProducts,
      total: selectedProducts.length
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
