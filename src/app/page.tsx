import React from 'react';
import Link from 'next/link';
// Datos via API interna para mantener claves seguras en el servidor
import { ProductGrid } from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/Button';
import { CarIcon } from '@/components/icons/Icons';

export const revalidate = 300; // Revalidar cada 5 minutos

export default async function HomePage() {
  let featuredProducts: any[] = [];

  try {
    // Usar URL relativa para evitar problemas de puerto en desarrollo
    // Next.js manejará esto correctamente tanto en desarrollo como en producción
    const featuredRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/api/products/featured`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!featuredRes.ok) {
      throw new Error(`HTTP ${featuredRes.status}: ${featuredRes.statusText}`);
    }
    
    const featuredJson = await featuredRes.json();
    featuredProducts = Array.isArray(featuredJson?.products) ? featuredJson.products : [];
    
    console.log(`🌟 [HomePage] Productos destacados obtenidos: ${featuredProducts.length}`);
    if (featuredProducts.length > 0) {
      console.log(`🌟 [HomePage] Productos:`, featuredProducts.map(p => p.name).join(', '));
    } else {
      console.warn(`⚠️ [HomePage] No se encontraron productos destacados`);
    }
  } catch (e) {
    console.error('❌ [HomePage] Error cargando productos destacados:', e);
    // Fallback: intentar obtener algunos productos regulares como destacados
    try {
      console.log('🔄 [HomePage] Intentando fallback con productos regulares...');
      const fallbackRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/api/products?limit=6`, { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (fallbackRes.ok) {
        const fallbackJson = await fallbackRes.json();
        const allProducts = Array.isArray(fallbackJson?.products) ? fallbackJson.products : [];
        featuredProducts = allProducts.slice(0, 6); // Tomar los primeros 6 como destacados
        console.log(`🔄 [HomePage] Fallback exitoso: ${featuredProducts.length} productos`);
      }
    } catch (fallbackError) {
      console.error('❌ [HomePage] Fallback también falló:', fallbackError);
      featuredProducts = [];
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-24 overflow-hidden border-b border-gray-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <CarIcon className="mx-auto h-16 w-16 text-rosso" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Bienvenido a{' '}
              <span className="text-rosso">Grupo Roso</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tu tienda especializada en accesorios automotrices de alta calidad. 
              Encuentra todo lo que necesitas para personalizar y mejorar el rendimiento de tu vehículo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/catalogo">
                  Explorar Catálogo
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-3">
                <Link href="/sobre">
                  Conoce Más
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones de categorías y marcas removidas: la Home ahora depende solo de Products */}

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Descubre nuestros productos más populares y las últimas novedades en accesorios automotrices.
            </p>
          </div>
          
          {/* Productos destacados reales */}
          <ProductGrid products={featuredProducts} loading={false} />
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/catalogo">Ver Todos los Productos</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-rosso">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Necesitas ayuda para encontrar el accesorio perfecto?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Nuestro equipo de expertos está listo para asesorarte y ayudarte a encontrar 
            exactamente lo que necesitas para tu vehículo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg" className="bg-white text-rosso hover:bg-gray-100">
              <Link href="/contacto">Contáctanos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-rosso">
              <Link href="tel:+50570000000">Llamar Ahora</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}