import Airtable from 'airtable';
import { Category, Brand, Product, FilterOptions } from './types';
import { slugify } from './utils';

// Configuración de Airtable
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app4xBwfGa1IwoCkr';
const CATEGORIES_TABLE = process.env.AIRTABLE_CATEGORIES_TABLE || 'Categories';
const BRANDS_TABLE = process.env.AIRTABLE_BRANDS_TABLE || 'Brands';
const PRODUCTS_TABLE = process.env.AIRTABLE_PRODUCTS_TABLE || 'Products';

// Inicializar Airtable solo si tenemos la API key
let base: any = null;
if (AIRTABLE_API_KEY) {
  Airtable.configure({ apiKey: AIRTABLE_API_KEY });
  base = Airtable.base(AIRTABLE_BASE_ID);
}


// Funciones de transformación
function formatCategory(record: any): Category {
  return {
    id: record.id,
    name: record.fields.Name,
    slug: record.fields.Slug || slugify(record.fields.Name),
    description: record.fields.Description || ''
  };
}

function formatBrand(record: any): Brand {
  return {
    id: record.id,
    name: record.fields.Name,
    slug: record.fields.Slug || slugify(record.fields.Name),
    description: record.fields.Description || '',
    logo: record.fields.Logo ? record.fields.Logo.map((img: any) => img.url) : []
  };
}

function formatProduct(record: any, categories: Category[] = [], brands: Brand[] = []): Product {
  const fields = record.fields;
  
  // Crear objetos por defecto para categoría y marca
  const defaultCategory: Category = {
    id: 'default',
    name: 'Sin categoría',
    slug: 'sin-categoria',
    description: 'Categoría por defecto'
  };
  
  const defaultBrand: Brand = {
    id: 'default',
    name: 'Sin marca',
    slug: 'sin-marca',
    description: 'Marca por defecto'
  };

  // Resolver nombres provenientes de LOOKUPs (string[])
  const categoryName = Array.isArray(fields.Categoria)
    ? (fields.Categoria[0] ?? '')
    : (fields.Categoria ?? '');
  const brandName = Array.isArray(fields.Marca)
    ? (fields.Marca[0] ?? '')
    : (fields.Marca ?? '');

  const category: Category = categoryName
    ? {
        id: slugify(categoryName),
        name: categoryName,
        slug: slugify(categoryName),
        description: ''
      }
    : defaultCategory;

  const brand: Brand = brandName
    ? {
        id: slugify(brandName),
        name: brandName,
        slug: slugify(brandName),
        description: ''
      }
    : defaultBrand;

  return {
    id: record.id,
    name: fields.Name || '',
    slug: slugify(fields.Name || 'producto'),
    sku: fields.SKU || '',
    description: fields.Description || '',
    priceRetail: fields['Price Retail'] || 0,
    priceWholesale: fields['Price Wholesale'] || 0,
    stock: fields.Stock || 0,
    category,
    brand,
    images: fields.Images ? fields.Images.map((img: any) => img.url) : [],
    active: fields.Active || false,
    createdTime: fields.createdTime || (record as any).createdTime
  };
}

// Funciones públicas
export async function getCategories(): Promise<Category[]> {
  if (!base) {
    console.log('⚠️ No hay conexión con Airtable, devolviendo array vacío');
    return [];
  }
  
  try {
    const records = await base(CATEGORIES_TABLE).select().all();
    const categories = records.map(formatCategory);
    console.log(`✅ Categorías obtenidas de Airtable: ${categories.length}`);
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return []; // Devolver array vacío en lugar de mock
  }
}

export async function getBrands(): Promise<Brand[]> {
  if (!base) {
    console.log('⚠️ No hay conexión con Airtable, devolviendo array vacío');
    return [];
  }
  
  try {
    const records = await base(BRANDS_TABLE).select().all();
    const brands = records.map(formatBrand);
    console.log(`✅ Marcas obtenidas de Airtable: ${brands.length}`);
    return brands;
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    return []; // Devolver array vacío en lugar de mock
  }
}

export async function getProducts(options: FilterOptions = {}): Promise<Product[]> {
  // Respetar configuración de entorno y base inicializada
  if (!base) {
    console.warn('⚠️ Airtable no configurado (falta API key/base). Devolviendo []');
    return [];
  }

  try {
    // Obtener registros de la tabla configurada
    const records = await base(PRODUCTS_TABLE).select({
      // Se puede ajustar pageSize si crece el dataset
      pageSize: 100,
    }).all();

    let products = records.map((r: any) => formatProduct(r));

    // Filtrado en memoria según FilterOptions
    if (options.category) {
      const cat = slugify(options.category);
      products = products.filter((p: Product) => p.category && (p.category.slug === cat || p.category.name.toLowerCase() === options.category!.toLowerCase()));
    }

    if (options.brand) {
      const br = slugify(options.brand);
      products = products.filter((p: Product) => p.brand && (p.brand.slug === br || p.brand.name.toLowerCase() === options.brand!.toLowerCase()));
    }

    if (typeof options.priceMin === 'number') {
      products = products.filter((p: Product) => (p.priceRetail ?? 0) >= (options.priceMin as number));
    }

    if (typeof options.priceMax === 'number') {
      products = products.filter((p: Product) => (p.priceRetail ?? 0) <= (options.priceMax as number));
    }

    if (typeof options.inStock === 'boolean') {
      products = products.filter((p: Product) => (p.stock ?? 0) > 0 === options.inStock);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      products = products.filter((p: Product) =>
        (p.name?.toLowerCase().includes(q)) ||
        (p.description?.toLowerCase().includes(q)) ||
        (p.sku?.toLowerCase().includes(q))
      );
    }

    // Ordenamiento simple
    switch (options.sortBy) {
      case 'price-asc':
        products.sort((a: Product, b: Product) => (a.priceRetail ?? 0) - (b.priceRetail ?? 0));
        break;
      case 'price-desc':
        products.sort((a: Product, b: Product) => (b.priceRetail ?? 0) - (a.priceRetail ?? 0));
        break;
      case 'newest':
        products.sort((a: Product, b: Product) => new Date(b.createdTime || 0).getTime() - new Date(a.createdTime || 0).getTime());
        break;
      case 'name':
        products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return products;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ getProducts - Error:', error.message);
    } else {
      console.error('❌ getProducts - Error (unknown):', error);
    }
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(product => product.slug === slug) || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(category => category.slug === slug) || null;
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const brands = await getBrands();
  return brands.find(brand => brand.slug === slug) || null;
}

export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  const allProducts = await getProducts();
  
  // Filtrar productos relacionados (misma categoría o marca, excluyendo el producto actual)
  const related = allProducts.filter((p: Product) => 
    p.id !== product.id && 
    (p.category?.id === product.category?.id || p.brand?.id === product.brand?.id)
  );
  
  return related.slice(0, limit);
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  console.log('🎯 getFeaturedProducts - INICIANDO...');
  
  try {
    const products = await getProducts();
    console.log(`🎯 getFeaturedProducts - Resultado getProducts: ${products.length} productos`);
    
    if (products.length === 0) {
      console.log('❌ getFeaturedProducts - NO HAY PRODUCTOS, verificar getProducts()');
    } else {
      console.log(`✅ getFeaturedProducts - Devolviendo ${Math.min(products.length, limit)} de ${products.length} productos`);
    }
    
    return products.slice(0, limit);
  } catch (error) {
    console.error('❌ getFeaturedProducts - ERROR:', error);
    return [];
  }
}