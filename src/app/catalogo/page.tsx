"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
// Categorías y marcas ahora se obtienen vía API interna
import { Product, Category, Brand, FilterOptions } from '@/lib/types';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { FiltersPanel } from '@/components/features/FiltersPanel';
import { Button } from '@/components/ui/Button';
import { FilterIcon } from '@/components/icons/Icons';
import { useDebounce } from '@/hooks/useDebounce';

function CatalogoPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Construir filtros desde URL
  const [urlFilters, setUrlFilters] = useState<FilterOptions>({});
  
  useEffect(() => {
    const filters: FilterOptions = {
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      inStock: searchParams.get('inStock') === '1', // Desmarcado por defecto, muestra todos los productos
      sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'newest',
      search: debouncedSearchTerm || undefined
    };
    setUrlFilters(filters);
  }, [searchParams, debouncedSearchTerm]);
  
  const filters = urlFilters;

  // Ya no cargamos categorías/marcas desde APIs separadas.

  // Cargar productos cuando cambien los filtros (desde API server-side)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', String(filters.category));
        if (filters.brand) params.set('brand', String(filters.brand));
        if (typeof filters.priceMin === 'number') params.set('priceMin', String(filters.priceMin));
        if (typeof filters.priceMax === 'number') params.set('priceMax', String(filters.priceMax));
        if (filters.inStock) params.set('inStock', '1');
        if (filters.sortBy) params.set('sortBy', String(filters.sortBy));
        if (filters.search) params.set('search', String(filters.search));

        const res = await fetch(`/api/products?${params.toString()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: Product[] = Array.isArray(data.products) ? data.products : [];
        setProducts(list);

        // Derivar categorías y marcas desde los productos
        const slugify = (s: string) => s.toLowerCase().trim().replace(/\s+/g, '-');
        const catMap = new Map<string, Category>();
        const brandMap = new Map<string, Brand>();
        for (const p of list) {
          const cname = p.category?.name || '';
          if (cname) {
            const cslug = p.category?.slug || slugify(cname);
            if (!catMap.has(cslug)) {
              catMap.set(cslug, { id: cslug, name: cname, slug: cslug, description: '' });
            }
          }
          const bname = p.brand?.name || '';
          if (bname) {
            const bslug = p.brand?.slug || slugify(bname);
            if (!brandMap.has(bslug)) {
              brandMap.set(bslug, { id: bslug, name: bname, slug: bslug, description: '' });
            }
          }
        }
        setCategories(Array.from(catMap.values()));
        setBrands(Array.from(brandMap.values()));
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setCategories([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        {/* Header */}
        <div className="mb-6">
          <div className="text-center lg:text-left mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
              Catálogo de Productos
            </h1>
            <p className="text-gray-700 text-sm sm:text-base">
              {loading ? 'Cargando productos...' : `${products.length} productos encontrados`}
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder:text-gray-500 focus:border-rosso focus:outline-none transition-colors duration-200 text-sm sm:text-base"
              />
            </div>
            
            {/* Mobile filters toggle */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 text-sm"
              aria-label="Filtros"
            >
              <FilterIcon size={18} className="mr-2" />
              Filtros
            </Button>
          </div>
        </div>
        
        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            />
            {/* Filters Panel */}
            <div className="absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-black">Filtros</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </Button>
                </div>
                <FiltersPanel
                  categories={categories}
                  brands={brands}
                  currentFilters={filters}
                  onFiltersChange={() => setShowFilters(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="lg:flex lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FiltersPanel
              categories={categories}
              brands={brands}
              currentFilters={filters}
              onFiltersChange={() => setShowFilters(false)}
            />
          </aside>
          
          {/* Products Grid */}
          <main className="flex-1 lg:min-w-0">
            <ProductGrid products={products} loading={loading} />
            
            {/* Load More - Para futuras mejoras de paginación */}
            {!loading && products.length > 0 && products.length % 20 === 0 && (
              <div className="text-center mt-12">
                <Button variant="secondary">
                  Cargar Más Productos
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CatalogoPageContent />
    </Suspense>
  );
}