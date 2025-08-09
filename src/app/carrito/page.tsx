"use client";

import React from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from '@/components/icons/Icons';

export default function CarritoPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();

  const generateWhatsAppMessage = () => {
    let message = `¡Hola! Me interesa consultar sobre estos productos de Grupo Roso:\n\n`;
    
    cart.items.forEach((item, index) => {
      const product = item.product;
      message += `${index + 1}. *${product.name}*\n`;
      message += `   - Marca: ${product.brand?.name || 'N/A'}\n`;
      message += `   - SKU: ${product.sku}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: ${formatPrice(product.priceRetail)}\n\n`;
    });
    
    message += `*Resumen:*\n`;
    message += `Total de productos: ${cart.itemCount}\n`;
    message += `Subtotal: ${formatPrice(cart.total)}\n`;
    message += `Total estimado: ${formatPrice(cart.total + (cart.total >= 100 ? 0 : 15))}\n\n`;
    message += `¿Podrían darme más información sobre disponibilidad y formas de pago?`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppContact = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/50588793873?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Carrito de Compras' }
  ];

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-anthracite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <div className="text-center py-16">
            <div className="mb-8">
              <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-neutral" />
            </div>
            <h1 className="text-3xl font-bold text-white-soft mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-xl text-gray-neutral mb-8 max-w-md mx-auto">
              Añade algunos productos increíbles para personalizar tu vehículo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/catalogo">Explorar Productos</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-anthracite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white-soft">
                Carrito de Compras
              </h1>
              <Button
                onClick={clearCart}
                variant="ghost"
                size="sm"
                className="text-gray-neutral hover:text-red-400"
              >
                Limpiar Carrito
              </Button>
            </div>
            
            <div className="space-y-4">
              {cart.items.map((item) => {
                const product = item.product;
                const productImage = product.images?.[0] || '/images/placeholder-product.jpg';
                
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Link href={`/producto/${product.slug}`}>
                            <div className="relative w-24 h-24 bg-gray-800 rounded overflow-hidden">
                              <Image
                                src={productImage}
                                alt={product.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-200"
                                sizes="96px"
                              />
                            </div>
                          </Link>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="mb-4 md:mb-0">
                              <Link 
                                href={`/producto/${product.slug}`}
                                className="hover:text-rosso transition-colors duration-200"
                              >
                                <h3 className="font-semibold text-white-soft text-lg mb-1">
                                  {product.name}
                                </h3>
                              </Link>
                              
                              {product.brand && (
                                <p className="text-sm text-gray-neutral mb-1">
                                  {product.brand.name}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-neutral font-mono">
                                SKU: {product.sku}
                              </p>
                              
                              {product.stock <= 5 && product.stock > 0 && (
                                <Badge variant="warning" className="mt-2">
                                  Solo {product.stock} disponibles
                                </Badge>
                              )}
                            </div>
                            
                            {/* Price and Quantity Controls */}
                            <div className="flex flex-col items-end space-y-4">
                              <div className="text-right">
                                <p className="text-lg font-semibold text-rosso">
                                  {formatPrice(product.priceRetail)}
                                </p>
                                <p className="text-sm text-gray-neutral">
                                  Subtotal: {formatPrice(product.priceRetail * item.quantity)}
                                </p>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="text-white-soft hover:text-rosso"
                                >
                                  <MinusIcon size={16} />
                                </Button>
                                
                                <span className="w-12 text-center text-white-soft font-medium">
                                  {item.quantity}
                                </span>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(product.id, item.quantity + 1)}
                                  disabled={item.quantity >= product.stock}
                                  className="text-white-soft hover:text-rosso"
                                >
                                  <PlusIcon size={16} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(product.id)}
                                  className="text-gray-neutral hover:text-red-400 ml-4"
                                  aria-label="Eliminar producto"
                                >
                                  <TrashIcon size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-96">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-neutral">Productos ({cart.itemCount}):</span>
                    <span className="text-white-soft">{formatPrice(cart.total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-neutral">Envío:</span>
                    <span className="text-white-soft">
                      {cart.total >= 100 ? 'Gratuito' : formatPrice(15)}
                    </span>
                  </div>
                  
                  {cart.total < 100 && (
                    <p className="text-xs text-gray-neutral">
                      Envío gratuito en compras mayores a {formatPrice(100)}
                    </p>
                  )}
                </div>
                
                <hr className="border-gray-700" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-white-soft">Total:</span>
                  <span className="text-rosso">
                    {formatPrice(cart.total + (cart.total >= 100 ? 0 : 15))}
                  </span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWhatsAppContact}
                  >
                    💬 Consultar por WhatsApp
                  </Button>
                  
                  <Button asChild variant="secondary" size="lg" className="w-full">
                    <Link href="/catalogo">Continuar Comprando</Link>
                  </Button>
                </div>
                
                <div className="pt-4 text-xs text-gray-neutral space-y-1">
                  <p>• Garantía del fabricante incluida</p>
                  <p>• Instalación profesional disponible</p>
                  <p>• Soporte técnico especializado</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}