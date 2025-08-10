"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { PlusIcon } from '@/components/icons/Icons';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const isOutOfStock = product.stock <= 0;
  const productImage = product.images?.[0] || '/images/placeholder-product.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product);
    }
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-250 hover:shadow-lg hover:-translate-y-1 ${className}`}>
      <Link href={`/producto/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock && (
              <Badge variant="no-stock">Sin Stock</Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="warning">Pocos disponibles</Badge>
            )}
          </div>
          
          {/* Hover overlay with Add to Cart */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              variant={isOutOfStock ? 'disabled' : 'primary'}
              size="sm"
              className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-250"
            >
              {isOutOfStock ? 'Sin Stock' : (
                <>
                  <PlusIcon size={16} className="mr-1" />
                  Añadir al Carrito
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-300 uppercase tracking-wider">
                {product.brand.name}
              </p>
            )}
            
            {/* Product Name */}
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {/* SKU */}
            <p className="text-xs text-gray-300 font-mono">
              SKU: {product.sku}
            </p>
            
            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-semibold text-rosso">
                {formatPrice(product.priceRetail)}
              </span>
              
              {/* Stock indicator */}
              <span className={`text-xs ${
                isOutOfStock 
                  ? 'text-red-400' 
                  : product.stock <= 5 
                    ? 'text-yellow-400' 
                    : 'text-green-400'
              }`}>
                {isOutOfStock ? 'Sin stock' : `${product.stock} disponibles`}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}