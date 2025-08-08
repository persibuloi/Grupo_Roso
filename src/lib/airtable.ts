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

  return {
    id: record.id,
    name: fields.Name || '',
    slug: slugify(fields.Name || 'producto'),
    sku: fields.SKU || '',
    description: fields.Description || '',
    priceRetail: fields['Price Retail'] || 0,
    priceWholesale: fields['Price Wholesale'] || 0,
    stock: fields.Stock || 0,
    category: defaultCategory,
    brand: defaultBrand,
    images: fields.Images ? fields.Images.map((img: any) => img.url) : [],
    active: fields.Active || false,
    createdTime: fields.createdTime || record.createdTime
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
  console.log('🔍 getProducts - SOLUCION DIRECTA');
  
  try {
    // Crear conexión directa con valores hardcodeados para garantizar que funcione
    const directBase = Airtable.base('appPDMVHaoYx7wL9P');
    
    console.log('🛍️ Conectando directamente a Products...');
    
    const records = await directBase('Products').select({
      maxRecords: 10
    }).all();
    
    console.log(`📦 Registros obtenidos DIRECTAMENTE: ${records.length}`);
    
    if (records.length === 0) {
      console.log('❌ NO HAY REGISTROS - Problema con la tabla o conexión');
      return [];
    }
    
    const products = records.map((record: any) => {
      const fields = record.fields;
      console.log(`🔍 Procesando DIRECTO: ${fields.Name}`);
      
      return {
        id: record.id,
        name: fields.Name || '',
        slug: fields.Name ? fields.Name.toLowerCase().replace(/\s+/g, '-') : '',
        sku: fields.SKU || '',
        description: fields.Description || '',
        priceRetail: fields['Price Retail'] || 0,
        priceWholesale: fields['Price Wholesale'] || 0,
        stock: fields.Stock || 0,
        category: { id: 'default', name: 'General', slug: 'general', description: '' },
        brand: { id: 'default', name: 'General', slug: 'general', description: '' },
        images: fields.Images ? fields.Images.map((img: any) => img.url) : [],
        active: fields.Active || false,
        createdTime: fields.createdTime || record.createdTime
      };
    });
    
    console.log(`✅ Productos procesados DIRECTAMENTE: ${products.length}`);
    return products;
    
  } catch (error) {
    console.error('❌ Error DIRECTO:', error.message);
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