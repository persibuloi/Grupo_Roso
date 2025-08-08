"use client";

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@/components/icons/Icons';

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, disabled = false, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, getItemQuantity } = useCartStore();
  
  const currentQuantity = getItemQuantity(product.id);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simular delay para mejorar UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem(product, quantity);
    setIsAdding(false);
    
    // Reset quantity a 1 después de agregar
    setQuantity(1);
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const maxQuantity = Math.min(product.stock, 10); // Limite máximo de 10 por compra
  
  if (disabled) {
    return (
      <Button 
        variant="disabled" 
        size="lg" 
        className={`w-full ${className}`}
        disabled
      >
        Sin Stock
      </Button>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-neutral font-medium">Cantidad:</span>
        <div className="flex items-center border border-gray-700 rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="px-3 py-2 text-white-soft hover:text-rosso disabled:opacity-50"
            aria-label="Disminuir cantidad"
          >
            <MinusIcon size={16} />
          </Button>
          
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setQuantity(Math.min(Math.max(1, value), maxQuantity));
            }}
            className="w-16 text-center bg-transparent border-none text-white-soft focus:outline-none focus:ring-0"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= maxQuantity}
            className="px-3 py-2 text-white-soft hover:text-rosso disabled:opacity-50"
            aria-label="Aumentar cantidad"
          >
            <PlusIcon size={16} />
          </Button>
        </div>
        
        <span className="text-xs text-gray-neutral">
          Máx: {maxQuantity}
        </span>
      </div>
      
      {/* Add to Cart Button */}
      <Button 
        onClick={handleAddToCart}
        disabled={isAdding || quantity > product.stock}
        size="lg"
        className="w-full relative"
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            Agregando...
          </>
        ) : (
          <>
            <ShoppingCartIcon size={20} className="mr-2" />
            Añadir al Carrito
          </>
        )}
      </Button>
      
      {/* Current Cart Quantity */}
      {currentQuantity > 0 && (
        <p className="text-sm text-rosso text-center">
          Ya tienes {currentQuantity} {currentQuantity === 1 ? 'unidad' : 'unidades'} en tu carrito
        </p>
      )}
    </div>
  );
}