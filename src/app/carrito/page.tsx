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
                const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
                
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <Link href={`/producto/${product.slug}`}>
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border border-gray-300 rounded overflow-hidden">
                              {productImage ? (
                                <Image
                                  src={productImage}
                                  alt={product.name}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-200"
                                  sizes="(max-width: 640px) 80px, 96px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <Link 
                                href={`/producto/${product.slug}`}
                                className="hover:text-rosso transition-colors duration-200"
                              >
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                                  {product.name}
                                </h3>
                              </Link>
                              
                              {product.brand && (
                                <p className="text-sm text-gray-600 mb-1">
                                  Marca: {product.brand.name}
                                </p>
                              )}
                              
                              <p className="text-xs text-gray-500 font-mono mb-2">
                                SKU: {product.sku}
                              </p>
                              
                              {product.stock <= 5 && product.stock > 0 && (
                                <Badge variant="warning" className="mt-2">
                                  Solo {product.stock} disponibles
                                </Badge>
                              )}
                            </div>
                            
                            {/* Price and Quantity Controls */}
                            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end lg:items-end gap-4">
                              <div className="text-center sm:text-right">
                                <p className="text-lg font-semibold text-rosso">
                                  {formatPrice(product.priceRetail)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Subtotal: {formatPrice(product.priceRetail * item.quantity)}
                                </p>
                              </div>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="text-gray-700 hover:text-rosso border border-gray-300 hover:border-rosso bg-white"
                                >
                                  <MinusIcon size={16} />
                                </Button>
                                
                                <span className="w-12 text-center text-gray-900 font-medium bg-gray-100 border border-gray-300 py-1 px-2 rounded">
                                  {item.quantity}
                                </span>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(product.id, item.quantity + 1)}
                                  disabled={item.quantity >= product.stock}
                                  className="text-gray-700 hover:text-rosso border border-gray-300 hover:border-rosso bg-white"
                                >
                                  <PlusIcon size={16} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(product.id)}
                                  className="text-gray-600 hover:text-red-500 ml-2 border border-gray-300 hover:border-red-400 bg-white"
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
          <div className="w-full lg:w-96 mt-8 lg:mt-0">
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Productos ({cart.itemCount}):</span>
                    <span className="text-gray-900 font-medium">{formatPrice(cart.total)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span className="text-gray-900 font-medium">
                      {cart.total >= 100 ? 'Gratuito' : formatPrice(15)}
                    </span>
                  </div>
                  
                  {cart.total < 100 && (
                    <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded border">
                      💡 Envío gratuito en compras mayores a {formatPrice(100)}
                    </p>
                  )}
                </div>
                
                <hr className="border-gray-300" />
                
                <div className="flex justify-between font-bold text-xl">
                  <span className="text-gray-900">Total:</span>
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
                  
                  <Button asChild variant="secondary" size="lg" className="w-full text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300">
                    <Link href="/catalogo">Continuar Comprando</Link>
                  </Button>
                </div>
                
                <div className="pt-4 text-xs text-gray-700 space-y-1 bg-gray-100 border p-3 rounded">
                  <p>✅ Garantía del fabricante incluida</p>
                  <p>🔧 Instalación profesional disponible</p>
                  <p>📞 Soporte técnico especializado</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}