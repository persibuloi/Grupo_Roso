import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { generateSEOTitle } from '@/lib/utils';
import { Breadcrumbs } from '@/components/features/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CarIcon } from '@/components/icons/Icons';

export const metadata: Metadata = {
  title: generateSEOTitle('Sobre Nosotros'),
  description: 'Conoce la historia de Grupo Rosso, tu tienda especializada en accesorios automotrices de alta calidad en Nicaragua.',
  keywords: 'Grupo Rosso, historia, misión, visión, accesorios auto, Nicaragua',
  openGraph: {
    title: 'Sobre Nosotros - Grupo Rosso',
    description: 'Conoce la historia de Grupo Rosso, tu tienda especializada en accesorios automotrices de alta calidad.',
    type: 'website'
  }
};

export default function SobrePage() {
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre Nosotros' }
  ];

  const values = [
    {
      title: 'Calidad Premium',
      description: 'Trabajamos únicamente con las mejores marcas del mercado para garantizar productos de la más alta calidad.'
    },
    {
      title: 'Asesoramiento Experto',
      description: 'Nuestro equipo de especialistas te ayuda a encontrar exactamente lo que necesitas para tu vehículo.'
    },
    {
      title: 'Servicio Excepcional',
      description: 'Desde la venta hasta la instalación, brindamos un servicio completo y personalizado.'
    },
    {
      title: 'Innovación Constante',
      description: 'Nos mantenemos a la vanguardia de las últimas tendencias y tecnologías automotrices.'
    }
  ];

  const team = [
    {
      name: 'Carlos Rosso',
      position: 'Fundador y Director General',
      description: 'Con más de 15 años de experiencia en el sector automotriz, Carlos lidera la visión estratégica de Grupo Rosso.'
    },
    {
      name: 'Ana Martínez',
      position: 'Directora de Ventas',
      description: 'Especialista en atención al cliente y desarrollo de relaciones comerciales de largo plazo.'
    },
    {
      name: 'Miguel Álvarez',
      position: 'Jefe Técnico',
      description: 'Experto en instalación y configuración de sistemas de performance y accesorios especializados.'
    }
  ];

  return (
    <div className="min-h-screen bg-anthracite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="mb-8">
            <CarIcon className="mx-auto h-16 w-16 text-rosso" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white-soft mb-6">
            Sobre <span className="text-rosso">Grupo Rosso</span>
          </h1>
          <p className="text-xl text-gray-neutral max-w-3xl mx-auto leading-relaxed">
            Somos más que una tienda de accesorios automotrices. Somos tu socio de confianza 
            para transformar y mejorar la experiencia de conducción de tu vehículo.
          </p>
        </section>
        
        {/* Historia */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white-soft mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-neutral leading-relaxed">
                <p>
                  Fundado en 2010, Grupo Rosso nació de la pasión por los automóviles y el deseo 
                  de ofrecer a los entusiastas nicaragüenses acceso a accesorios de clase mundial.
                </p>
                <p>
                  Comenzamos como una pequeña tienda especializada en filtros de aire de alto 
                  rendimiento y hemos crecido hasta convertirnos en el distribuidor líder de 
                  accesorios automotrices premium en Nicaragua.
                </p>
                <p>
                  A lo largo de los años, hemos construido relaciones sólidas con las mejores 
                  marcas del mercado: K&N, Borla, WeatherTech, Pioneer y muchas más, garantizando 
                  que nuestros clientes tengan acceso a productos de la más alta calidad.
                </p>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-4xl font-bold text-rosso mb-2">14+</h3>
                    <p className="text-gray-neutral">Años de experiencia</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-rosso mb-2">5,000+</h3>
                    <p className="text-gray-neutral">Clientes satisfechos</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-rosso mb-2">50+</h3>
                    <p className="text-gray-neutral">Marcas premium</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-rosso mb-2">1,000+</h3>
                    <p className="text-gray-neutral">Productos disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Misión y Visión */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white-soft mb-4">Nuestra Misión</h3>
                <p className="text-gray-neutral leading-relaxed">
                  Proporcionar a los entusiastas automotrices de Nicaragua acceso a los mejores 
                  accesorios del mercado, respaldados por asesoramiento experto y un servicio 
                  excepcional que supere las expectativas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white-soft mb-4">Nuestra Visión</h3>
                <p className="text-gray-neutral leading-relaxed">
                  Ser reconocidos como la tienda líder en Centroamérica para accesorios 
                  automotrices premium, estableciendo el estándar de excelencia en calidad, 
                  servicio e innovación.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white-soft text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-white-soft mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-neutral leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Equipo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white-soft text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-rosso/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-rosso">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white-soft mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-rosso mb-3">
                    {member.position}
                  </p>
                  <p className="text-sm text-gray-neutral leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-rosso to-red-700 rounded-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para mejorar tu vehículo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de accesorios premium y déjanos ayudarte 
            a encontrar exactamente lo que necesitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-rosso hover:bg-gray-100">
              <Link href="/catalogo">Explorar Productos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rosso">
              <Link href="/contacto">Contactar Asesor</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}