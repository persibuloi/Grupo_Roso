"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Brand, FilterOptions } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface FiltersPanelProps {
  categories: Category[];
  brands: Brand[];
  currentFilters: FilterOptions;
  onFiltersChange?: () => void;
}

export function FiltersPanel({ 
  categories, 
  brands, 
  currentFilters, 
  onFiltersChange 
}: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Actualizar parámetros
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    
    // Navegar con nuevos parámetros
    router.push(`/catalogo?${params.toString()}`);
    onFiltersChange?.();
  };

  const clearFilters = () => {
    router.push('/catalogo');
    onFiltersChange?.();
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filtros Activos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-rosso hover:text-rosso/80"
              >
                Limpiar Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentFilters.category && (
              <Badge variant="rosso" className="mr-2">
                Categoría: {categories.find(c => c.slug === currentFilters.category)?.name}
              </Badge>
            )}
            {currentFilters.brand && (
              <Badge variant="rosso" className="mr-2">
                Marca: {brands.find(b => b.slug === currentFilters.brand)?.name}
              </Badge>
            )}
            {currentFilters.priceMin && (
              <Badge variant="rosso" className="mr-2">
                Min: ${currentFilters.priceMin}
              </Badge>
            )}
            {currentFilters.priceMax && (
              <Badge variant="rosso" className="mr-2">
                Max: ${currentFilters.priceMax}
              </Badge>
            )}
            {currentFilters.inStock && (
              <Badge variant="rosso" className="mr-2">
                En Stock
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ordenamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ordenar Por</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currentFilters.sortBy || 'newest'}
            onChange={(e) => updateFilters({ sortBy: e.target.value as FilterOptions['sortBy'] })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white-soft focus:border-rosso focus:outline-none transition-colors duration-200"
          >
            <option value="newest">Más Recientes</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </CardContent>
      </Card>

      {/* Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button
              onClick={() => updateFilters({ category: undefined })}
              className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                !currentFilters.category
                  ? 'bg-rosso text-white'
                  : 'text-gray-neutral hover:text-rosso hover:bg-gray-800'
              }`}
            >
              Todas las Categorías
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => updateFilters({ category: category.slug })}
                className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                  currentFilters.category === category.slug
                    ? 'bg-rosso text-white'
                    : 'text-gray-neutral hover:text-rosso hover:bg-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marcas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button
              onClick={() => updateFilters({ brand: undefined })}
              className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                !currentFilters.brand
                  ? 'bg-rosso text-white'
                  : 'text-gray-neutral hover:text-rosso hover:bg-gray-800'
              }`}
            >
              Todas las Marcas
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => updateFilters({ brand: brand.slug })}
                className={`w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
                  currentFilters.brand === brand.slug
                    ? 'bg-rosso text-white'
                    : 'text-gray-neutral hover:text-rosso hover:bg-gray-800'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rango de Precios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rango de Precios (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-neutral mb-1">Precio Mínimo</label>
              <Input
                type="number"
                placeholder="0"
                value={currentFilters.priceMin || ''}
                onChange={(e) => updateFilters({ 
                  priceMin: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-neutral mb-1">Precio Máximo</label>
              <Input
                type="number"
                placeholder="1000"
                value={currentFilters.priceMax || ''}
                onChange={(e) => updateFilters({ 
                  priceMax: e.target.value ? Number(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.inStock || false}
              onChange={(e) => updateFilters({ inStock: e.target.checked })}
              className="w-4 h-4 text-rosso bg-gray-800 border-gray-700 rounded focus:ring-rosso focus:ring-2"
            />
            <span className="text-sm text-gray-neutral">Solo productos en stock</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}