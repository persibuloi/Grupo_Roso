// Tipos TypeScript para la integración con Airtable

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  products?: Product[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string[];
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  priceRetail: number;
  priceWholesale: number;
  stock: number;
  category?: Category;
  brand?: Brand;
  images?: string[];
  active: boolean;
  createdTime?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface FilterOptions {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
  search?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}