import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { getProductBySlug, getRelatedProducts } from '@/lib/airtable';
import { generateSEOTitle, generateMetaDescription, formatPrice } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { ProductGrid } from '@/components/features/ProductGrid';
import { AddToCartButton } from '@/components/features/AddToCartButton';
import { ProductGallery } from '@/components/features/ProductGallery';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Producto no encontrado | Grupo Roso'
    };
  }

  return {
    title: generateSEOTitle(product.name),
    description: generateMetaDescription(product.description),
    keywords: `${product.name}, ${product.brand?.name || ''}, ${product.category?.name || ''}, accesorios auto, Grupo Roso`,
    openGraph: {
      title: product.name,
      description: generateMetaDescription(product.description),
      images: product.images?.map(img => ({ url: img, alt: product.name })) || [],
      type: 'website'
    },
    alternates: {
      canonical: `/producto/${product.slug}`
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);
  const isOutOfStock = product.stock <= 0;
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    ...(product.category ? [{ 
      label: product.category.name, 
      href: `/categoria/${product.category.slug}` 
    }] : []),
    { label: product.name }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'Grupo Roso'
    },
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.priceRetail,
      priceCurrency: 'USD',
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Grupo Roso'
      }
    },
    image: product.images || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-anthracite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Gallery */}
            <div>
              <ProductGallery images={product.images || ['/images/placeholder-product.jpg']} alt={product.name} />
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              {product.brand && (
                <div>
                  <span className="text-sm text-gray-neutral uppercase tracking-wider">
                    {product.brand.name}
                  </span>
                </div>
              )}
              
              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white-soft leading-tight">
                {product.name}
              </h1>
              
              {/* SKU and Status */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-neutral font-mono">
                  SKU: {product.sku}
                </span>
                {isOutOfStock ? (
                  <Badge variant="no-stock">Sin Stock</Badge>
                ) : product.stock <= 5 ? (
                  <Badge variant="warning">Pocos disponibles</Badge>
                ) : (
                  <Badge variant="success">Disponible</Badge>
                )}
              </div>
              
              {/* Price */}
              <div className="py-4">
                <span className="text-4xl font-bold text-rosso">
                  {formatPrice(product.priceRetail)}
                </span>
                {product.stock > 0 && (
                  <p className="text-sm text-gray-neutral mt-1">
                    {product.stock} unidades disponibles
                  </p>
                )}
              </div>
              
              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <h3 className="text-lg font-semibold text-white-soft mb-3">Descripción</h3>
                <p className="text-gray-neutral leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Category */}
              {product.category && (
                <div>
                  <h3 className="text-lg font-semibold text-white-soft mb-2">Categoría</h3>
                  <a 
                    href={`/categoria/${product.category.slug}`}
                    className="text-rosso hover:text-rosso/80 transition-colors duration-200"
                  >
                    {product.category.name}
                  </a>
                </div>
              )}
              
              {/* Add to Cart */}
              <div className="pt-6">
                <AddToCartButton product={product} disabled={isOutOfStock} />
              </div>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white-soft mb-4">Especificaciones</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-neutral">SKU:</dt>
                    <dd className="text-white-soft font-mono">{product.sku}</dd>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between">
                      <dt className="text-gray-neutral">Marca:</dt>
                      <dd className="text-white-soft">{product.brand.name}</dd>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between">
                      <dt className="text-gray-neutral">Categoría:</dt>
                      <dd className="text-white-soft">{product.category.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-neutral">Disponibilidad:</dt>
                    <dd className={`font-medium ${
                      isOutOfStock ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {isOutOfStock ? 'Sin stock' : `${product.stock} en stock`}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white-soft mb-4">Información de Entrega</h3>
                <div className="space-y-3 text-gray-neutral">
                  <p>• Envío gratuito en compras mayores a $100</p>
                  <p>• Entrega en 2-3 días hábiles</p>
                  <p>• Garantía del fabricante incluida</p>
                  <p>• Instalación profesional disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-white-soft mb-8">
                Productos Relacionados
              </h2>
              <ProductGrid products={relatedProducts} />
            </section>
          )}
        </div>
      </div>
    </>
  );
}