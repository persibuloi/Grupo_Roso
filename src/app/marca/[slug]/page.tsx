import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { getBrandBySlug, getProducts } from '@/lib/airtable';
import { generateSEOTitle, generateMetaDescription } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export const revalidate = 300;

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  
  if (!brand) {
    return {
      title: 'Marca no encontrada | Grupo Rosso'
    };
  }

  return {
    title: generateSEOTitle(brand.name),
    description: generateMetaDescription(brand.description),
    keywords: `${brand.name}, accesorios auto, Grupo Rosso, ${brand.slug}`,
    openGraph: {
      title: brand.name,
      description: generateMetaDescription(brand.description),
      images: brand.logo?.map(img => ({ url: img, alt: `Logo ${brand.name}` })) || [],
      type: 'website'
    },
    alternates: {
      canonical: `/marca/${brand.slug}`
    }
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  
  if (!brand) {
    notFound();
  }

  const products = await getProducts({ brand: brand.slug });
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Marcas', href: '/marcas' },
    { label: brand.name }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    description: brand.description,
    url: `/marca/${brand.slug}`,
    logo: brand.logo?.[0],
    sameAs: [
      // Añadir enlaces a redes sociales de la marca si están disponibles
    ]
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
          
          {/* Brand Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Brand Logo */}
              {brand.logo?.[0] && (
                <div className="flex-shrink-0">
                  <Card className="p-6 bg-white">
                    <Image
                      src={brand.logo[0]}
                      alt={`Logo de ${brand.name}`}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </Card>
                </div>
              )}
              
              {/* Brand Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white-soft mb-4">
                  {brand.name}
                </h1>
                <p className="text-xl text-gray-neutral max-w-3xl leading-relaxed mb-6">
                  {brand.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <span className="text-sm text-gray-neutral">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                  </span>
                  <Button asChild variant="secondary" size="sm">
                    <a href={`/catalogo?brand=${brand.slug}`}>
                      Ver con Filtros
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white-soft mb-8">
              Productos de {brand.name}
            </h2>
            <ProductGrid products={products} />
          </div>
          
          {/* Call to Action */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white-soft mb-4">
                Productos de {brand.name} próximamente
              </h2>
              <p className="text-gray-neutral mb-8">
                Estamos trabajando para traerte los mejores productos de {brand.name}.
              </p>
              <Button asChild>
                <a href="/catalogo">Explorar Otras Marcas</a>
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white-soft mb-4">
                    ¿Necesitas más información sobre productos {brand.name}?
                  </h3>
                  <p className="text-gray-neutral mb-6">
                    Nuestros expertos pueden ayudarte a encontrar el producto perfecto de {brand.name} para tu vehículo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <a href="/contacto">Contactar Asesor</a>
                    </Button>
                    <Button asChild variant="secondary">
                      <a href={`/catalogo?brand=${brand.slug}`}>Ver con Filtros</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}