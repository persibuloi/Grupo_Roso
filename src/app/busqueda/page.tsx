"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { getProducts } from '@/lib/airtable';
import { Product } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SearchIcon } from '@/components/icons/Icons';

function BusquedaPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Búsqueda' }
  ];
  
  // Realizar búsqueda cuando cambie el término debounced
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setProducts([]);
        setHasSearched(false);
        return;
      }
      
      setLoading(true);
      setHasSearched(true);
      
      try {
        const results = await getProducts({ search: debouncedSearchQuery.trim() });
        setProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchQuery]);
  
  // Cargar query inicial desde URL y configurar estado inicial
  useEffect(() => {
    const initialQuery = searchParams.get('q') || '';
    if (initialQuery) {
      setSearchQuery(initialQuery);
      if (initialQuery.length >= 2) {
        setHasSearched(true);
      }
    }
  }, [searchParams]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se activa automáticamente con el debounce
  };
  
  return (
    <div className="min-h-screen bg-anthracite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white-soft mb-4">
            Buscar Productos
          </h1>
          <p className="text-lg text-gray-neutral mb-8 max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas para tu vehículo
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-neutral" 
                size={20} 
              />
              <Input
                type="text"
                placeholder="Buscar por nombre, SKU o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg w-full bg-gray-800 border-gray-700 rounded-lg focus:border-rosso"
              />
              {searchQuery && (
                <Button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-neutral hover:text-white-soft"
                >
                  ×
                </Button>
              )}
            </div>
          </form>
          
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-yellow-400 text-sm mt-2">
              Ingresa al menos 2 caracteres para buscar
            </p>
          )}
        </div>
        
        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-rosso border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-neutral">Buscando productos...</p>
          </div>
        )}
        
        {hasSearched && !loading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white-soft">
                {products.length > 0 
                  ? `${products.length} resultado${products.length !== 1 ? 's' : ''} para "${debouncedSearchQuery}"`
                  : `Sin resultados para "${debouncedSearchQuery}"`
                }
              </h2>
              
              {products.length > 0 && (
                <Button asChild variant="secondary" size="sm">
                  <a href={`/catalogo?search=${encodeURIComponent(debouncedSearchQuery)}`}>
                    Ver con Filtros
                  </a>
                </Button>
              )}
            </div>
            
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
                <div className="mb-8">
                  <SearchIcon className="mx-auto h-16 w-16 text-gray-neutral" />
                </div>
                <h3 className="text-xl font-semibold text-white-soft mb-4">
                  No encontramos productos que coincidan
                </h3>
                <div className="max-w-md mx-auto space-y-4 text-gray-neutral">
                  <p>Sugerencias para mejorar tu búsqueda:</p>
                  <ul className="text-left space-y-2">
                    <li>• Verifica la ortografía</li>
                    <li>• Usa términos más generales</li>
                    <li>• Prueba con sinónimos</li>
                    <li>• Busca por marca o categoría</li>
                  </ul>
                  <div className="pt-4">
                    <Button asChild>
                      <a href="/catalogo">Explorar Todo el Catálogo</a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Search Suggestions */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-white-soft mb-4">Búsquedas Populares</h3>
              <div className="space-y-2">
                {['Filtros K&N', 'Sistemas Borla', 'Tapetes WeatherTech', 'Audio Pioneer'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-neutral hover:text-rosso hover:bg-gray-800 rounded transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-white-soft mb-4">Por Categoría</h3>
              <div className="space-y-2">
                {[
                  { name: 'Interior', slug: 'accesorios-interior' },
                  { name: 'Exterior', slug: 'accesorios-exterior' },
                  { name: 'Electrónicos', slug: 'electronicos' },
                  { name: 'Performance', slug: 'performance' }
                ].map((category) => (
                  <a
                    key={category.slug}
                    href={`/categoria/${category.slug}`}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-neutral hover:text-rosso hover:bg-gray-800 rounded transition-colors duration-200"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-white-soft mb-4">Por Marca</h3>
              <div className="space-y-2">
                {[
                  { name: 'K&N', slug: 'kn' },
                  { name: 'Borla', slug: 'borla' },
                  { name: 'WeatherTech', slug: 'weathertech' },
                  { name: 'Pioneer', slug: 'pioneer' }
                ].map((brand) => (
                  <a
                    key={brand.slug}
                    href={`/marca/${brand.slug}`}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-neutral hover:text-rosso hover:bg-gray-800 rounded transition-colors duration-200"
                  >
                    {brand.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-white-soft mb-4">Ayuda</h3>
              <div className="space-y-2">
                <a
                  href="/contacto"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-neutral hover:text-rosso hover:bg-gray-800 rounded transition-colors duration-200"
                >
                  Contactar Asesor
                </a>
                <a
                  href="/catalogo"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-neutral hover:text-rosso hover:bg-gray-800 rounded transition-colors duration-200"
                >
                  Ver Catálogo Completo
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusquedaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-anthracite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <BusquedaPageContent />
    </Suspense>
  );
}