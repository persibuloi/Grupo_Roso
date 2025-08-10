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
  
  // Estados locales para los sliders (para evitar aplicar filtros inmediatamente)
  const [localPriceMin, setLocalPriceMin] = React.useState(currentFilters.priceMin || 0);
  const [localPriceMax, setLocalPriceMax] = React.useState(currentFilters.priceMax || 1000);
  const [sliderTimeout, setSliderTimeout] = React.useState<NodeJS.Timeout | null>(null);
  
  // Sincronizar estados locales cuando cambien los filtros externos
  React.useEffect(() => {
    setLocalPriceMin(currentFilters.priceMin || 0);
    setLocalPriceMax(currentFilters.priceMax || 1000);
  }, [currentFilters.priceMin, currentFilters.priceMax]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Actualizar parámetros
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else if (key === 'inStock') {
        // Manejo especial para checkbox: solo agregar si está marcado (true)
        if (value === true) {
          params.set(key, '1');
        } else {
          params.delete(key); // Eliminar si está desmarcado (false)
        }
      } else {
        params.set(key, value.toString());
      }
    });
    
    // Navegar con nuevos parámetros
    router.push(`/catalogo?${params.toString()}`);
    onFiltersChange?.();
  };

  // Función para manejar cambios de slider con debounce
  const handleSliderChange = (type: 'min' | 'max', value: number) => {
    // Actualizar estado local inmediatamente (para UI responsiva)
    if (type === 'min') {
      if (value <= localPriceMax) {
        setLocalPriceMin(value);
      }
    } else {
      if (value >= localPriceMin) {
        setLocalPriceMax(value);
      }
    }
    
    // Limpiar timeout anterior
    if (sliderTimeout) {
      clearTimeout(sliderTimeout);
    }
    
    // Aplicar filtros después de 500ms de inactividad
    const newTimeout = setTimeout(() => {
      const newFilters: Partial<FilterOptions> = {};
      if (type === 'min') {
        newFilters.priceMin = value === 0 ? undefined : value;
      } else {
        newFilters.priceMax = value === 1000 ? undefined : value;
      }
      updateFilters(newFilters);
    }, 500);
    
    setSliderTimeout(newTimeout);
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
              <CardTitle className="text-sm text-black">Filtros Activos</CardTitle>
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
          <CardTitle className="text-sm text-black">Ordenar Por</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currentFilters.sortBy || 'newest'}
            onChange={(e) => updateFilters({ sortBy: e.target.value as FilterOptions['sortBy'] })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:border-rosso focus:outline-none transition-colors duration-200"
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
          <CardTitle className="text-sm text-black">Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currentFilters.category || ''}
            onChange={(e) => updateFilters({ category: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:border-rosso focus:outline-none transition-colors duration-200"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Marcas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-black">Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currentFilters.brand || ''}
            onChange={(e) => updateFilters({ brand: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:border-rosso focus:outline-none transition-colors duration-200"
          >
            <option value="">Todas las Marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Rango de Precios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-black">Rango de Precios (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Valores actuales */}
            <div className="flex justify-between text-sm text-gray-700 font-medium">
              <span>${localPriceMin}</span>
              <span>${localPriceMax}</span>
            </div>
            
            {/* Range Sliders Separados */}
            <div className="space-y-3">
              {/* Precio Mínimo */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Precio Mínimo: ${localPriceMin}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={localPriceMin}
                  onChange={(e) => handleSliderChange('min', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-rosso"
                />
              </div>
              
              {/* Precio Máximo */}
              <div>
                <label className="block text-xs text-gray-700 mb-1">Precio Máximo: ${localPriceMax}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={localPriceMax}
                  onChange={(e) => handleSliderChange('max', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-rosso"
                />
              </div>
              
              {/* Rango visual */}
              <div className="text-center text-sm text-gray-600 bg-gray-50 py-2 rounded">
                Rango: ${localPriceMin} - ${localPriceMax}
              </div>
            </div>
            
            {/* Campos de entrada rápida (opcional) */}
            <div className="flex gap-2 pt-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={currentFilters.priceMin || ''}
                  onChange={(e) => {
                    const newMin = e.target.value ? Number(e.target.value) : undefined;
                    const currentMax = currentFilters.priceMax || 1000;
                    if (!newMin || newMin <= currentMax) {
                      updateFilters({ priceMin: newMin });
                    }
                  }}
                  className="text-xs"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={currentFilters.priceMax || ''}
                  onChange={(e) => {
                    const newMax = e.target.value ? Number(e.target.value) : undefined;
                    const currentMin = currentFilters.priceMin || 0;
                    if (!newMax || newMax >= currentMin) {
                      updateFilters({ priceMax: newMax });
                    }
                  }}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-black">Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.inStock || false}
              onChange={(e) => updateFilters({ inStock: e.target.checked })}
              className="w-4 h-4 text-rosso bg-white border-gray-300 rounded focus:ring-rosso focus:ring-2"
            />
            <span className="text-sm text-black">Solo productos en stock</span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}