// API Route para obtener productos directamente
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import type { Product } from '@/lib/types';

export async function GET(request: Request) {
  console.log('🎯 API Route - Iniciando obtención de productos...');
  
  try {
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY no está definido');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID no está definido');
    }
    const Airtable = require('airtable');
    
    console.log('🎯 API Route - Configurando Airtable...');
    Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
    
    // Leer query params
    const { searchParams } = new URL(request.url);
    const qSearch = searchParams.get('search')?.trim();
    const qInStock = searchParams.get('inStock') === '1';
    const qPriceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined;
    const qPriceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined;
    const qCategory = searchParams.get('category')?.toString().toLowerCase().trim();
    const qBrand = searchParams.get('brand')?.toString().toLowerCase().trim();
    const qSortByRaw = (searchParams.get('sortBy') || 'newest').toString();
    // Soportar variantes: price-asc/priceAsc, price-desc/priceDesc, newest, name
    const qSortBy =
      qSortByRaw === 'price-asc' || qSortByRaw === 'priceAsc'
        ? 'price-asc'
        : qSortByRaw === 'price-desc' || qSortByRaw === 'priceDesc'
        ? 'price-desc'
        : qSortByRaw === 'name'
        ? 'name'
        : 'newest';
    // category/brand ahora se derivan desde la propia tabla Products
    
    console.log('🎯 API Route - Obteniendo registros...');
    const records = await base('Products').select({
      // Airtable formula para filtrar activos y algunas condiciones simples
      // Notar que filtramos {Active} = TRUE() si existe, luego aplicamos filtros adicionales en memoria
      filterByFormula: 'IF({Active}, TRUE(), TRUE())',
      maxRecords: 100
    }).all();
    
    console.log(`🎯 API Route - Registros obtenidos: ${records.length}`);

    const slugify = (s: string) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-');
    const toStr = (v: any): string => {
      if (v == null) return '';
      if (Array.isArray(v)) return v.length ? String(v[0]) : '';
      return String(v);
    };

    let products: Product[] = records.map((record: any): Product => {
      const fields = record.fields;
      // Usar LOOKUPs en Products: 'Categoria' y 'Marca'
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
        category: categoryName
          ? { id: slugify(categoryName), name: categoryName, slug: slugify(categoryName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        brand: brandName
          ? { id: slugify(brandName), name: brandName, slug: slugify(brandName), description: '' }
          : { id: 'general', name: 'General', slug: 'general', description: '' },
        images: Array.isArray(fields.Images) ? fields.Images.map((img: any) => img.url) : [],
        active: fields.Active ?? true,
        createdTime: fields.createdTime || (record as any).createdTime
      };
    });
    
    // Filtros en memoria
    if (qSearch) {
      const s = qSearch.toLowerCase();
      products = products.filter((p: Product) => p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    if (qInStock) {
      products = products.filter((p: Product) => (p.stock ?? 0) > 0);
    }
    if (typeof qPriceMin === 'number' && !Number.isNaN(qPriceMin)) {
      products = products.filter((p: Product) => (p.priceRetail ?? 0) >= qPriceMin);
    }
    if (typeof qPriceMax === 'number' && !Number.isNaN(qPriceMax)) {
      products = products.filter((p: Product) => (p.priceRetail ?? 0) <= qPriceMax);
    }
    // Filtro por categoría y marca (comparar por slug o nombre)
    if (qCategory) {
      products = products.filter((p: Product) => {
        const slug = p.category?.slug?.toLowerCase();
        const name = p.category?.name?.toLowerCase();
        return slug === qCategory || name === qCategory;
      });
    }
    if (qBrand) {
      products = products.filter((p: Product) => {
        const slug = p.brand?.slug?.toLowerCase();
        const name = p.brand?.name?.toLowerCase();
        return slug === qBrand || name === qBrand;
      });
    }
    
    // Ordenamiento simple
    if (qSortBy === 'price-asc') {
      products.sort((a: Product, b: Product) => (a.priceRetail ?? 0) - (b.priceRetail ?? 0));
    } else if (qSortBy === 'price-desc') {
      products.sort((a: Product, b: Product) => (b.priceRetail ?? 0) - (a.priceRetail ?? 0));
    } else if (qSortBy === 'name') {
      products.sort((a: Product, b: Product) => String(a.name || '').localeCompare(String(b.name || '')));
    } else {
      // newest por createdTime (seguro si falta)
      const time = (p: Product) => (p.createdTime ? new Date(p.createdTime).getTime() : 0);
      products.sort((a: Product, b: Product) => time(b) - time(a));
    }
    
    console.log(`✅ API Route - Productos procesados: ${products.length}`);
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products
    });
    
  } catch (error: any) {
    console.error('❌ API Route - Error:', error?.stack || error?.message || error);
    
    return NextResponse.json({
      success: false,
      error: String(error?.message || error),
      count: 0,
      products: []
    }, { status: 500 });
  }
}
