"use client";

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export function ProductGrid({ products, loading = false, className }: ProductGridProps) {
  // Debug: verificar qué productos llegan al componente
  console.log('🎯 ProductGrid - DEBUG COMPLETO:');
  console.log('🎯 ProductGrid - Productos recibidos:', products);
  console.log('🎯 ProductGrid - Cantidad de productos:', products?.length || 'UNDEFINED');
  console.log('🎯 ProductGrid - Tipo de datos:', typeof products);
  console.log('🎯 ProductGrid - Es array?', Array.isArray(products));
  console.log('🎯 ProductGrid - Loading?', loading);
  console.log('🎯 ProductGrid - ClassName:', className);
  
  // Debug adicional: verificar estructura de productos
  if (products && products.length > 0) {
    console.log('🎯 ProductGrid - Primer producto:', products[0]);
    console.log('🎯 ProductGrid - Estructura del primer producto:', Object.keys(products[0]));
  }
  
  // Debug CRÍTICO: Alert en el cliente para verificar datos
  React.useEffect(() => {
    console.log('🚨 ProductGrid useEffect - Productos:', products?.length || 0);
    if (typeof window !== 'undefined') {
      // Solo mostrar alert una vez para no molestar
      if (!window.productGridDebugShown) {
        window.productGridDebugShown = true;
        alert(`ProductGrid recibió: ${products?.length || 0} productos`);
      }
    }
  }, [products]);
  
  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-neutral"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white-soft mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-neutral mb-6">
            No hay productos que coincidan con los filtros seleccionados. 
            Intenta ajustar tus criterios de búsqueda.
          </p>
          <button 
            onClick={() => window.location.href = '/catalogo'}
            className="text-rosso hover:text-rosso/80 font-medium transition-colors duration-200"
          >
            Ver todos los productos →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-anthracite rounded-lg border border-gray-dark overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton className="h-3 w-16" />
        
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* SKU */}
        <Skeleton className="h-3 w-24" />
        
        {/* Price and stock */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}