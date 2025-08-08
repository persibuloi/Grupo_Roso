import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug, getProducts } from '@/lib/airtable';
import { generateSEOTitle, generateMetaDescription } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/Button';

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Categoría no encontrada | Grupo Rosso'
    };
  }

  return {
    title: generateSEOTitle(category.name),
    description: generateMetaDescription(category.description),
    keywords: `${category.name}, accesorios auto, Grupo Rosso, ${category.slug}`,
    openGraph: {
      title: category.name,
      description: generateMetaDescription(category.description),
      type: 'website'
    },
    alternates: {
      canonical: `/categoria/${category.slug}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProducts({ category: category.slug });
  
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Catálogo', href: '/catalogo' },
    { label: category.name }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `/categoria/${category.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` : undefined
      }))
    }
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
          
          {/* Category Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white-soft mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-gray-neutral max-w-3xl leading-relaxed">
              {category.description}
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm text-gray-neutral">
                {products.length} {products.length === 1 ? 'producto' : 'productos'} encontrados
              </span>
              <Button asChild variant="secondary" size="sm">
                <a href={`/catalogo?category=${category.slug}`}>
                  Ver con Filtros
                </a>
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          <ProductGrid products={products} />
          
          {/* Call to Action */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white-soft mb-4">
                Esta categoría estará disponible pronto
              </h2>
              <p className="text-gray-neutral mb-8">
                Estamos trabajando para traerte los mejores productos en {category.name.toLowerCase()}.
              </p>
              <Button asChild>
                <a href="/catalogo">Explorar Otras Categorías</a>
              </Button>
            </div>
          ) : products.length > 12 && (
            <div className="text-center mt-12">
              <p className="text-gray-neutral mb-4">
                ¿Buscas algo más específico?
              </p>
              <Button asChild variant="secondary">
                <a href={`/catalogo?category=${category.slug}`}>
                  Usar Filtros Avanzados
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}