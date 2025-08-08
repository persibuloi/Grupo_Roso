import React from 'react';
import Link from 'next/link';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons/Icons';

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: 'Categorías',
    links: [
      { label: 'Accesorios de Interior', href: '/categoria/accesorios-interior' },
      { label: 'Accesorios de Exterior', href: '/categoria/accesorios-exterior' },
      { label: 'Electrónicos', href: '/categoria/electronicos' },
      { label: 'Performance', href: '/categoria/performance' },
    ]
  },
  {
    title: 'Marcas',
    links: [
      { label: 'K&N', href: '/marca/kn' },
      { label: 'Borla', href: '/marca/borla' },
      { label: 'WeatherTech', href: '/marca/weathertech' },
      { label: 'Pioneer', href: '/marca/pioneer' },
    ]
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nosotros', href: '/sobre' },
      { label: 'Contacto', href: '/contacto' },
      { label: 'Políticas de Privacidad', href: '/politicas' },
      { label: 'Términos y Condiciones', href: '/terminos' },
    ]
  }
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/gruporosso',
    icon: FacebookIcon
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/gruporosso',
    icon: InstagramIcon
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/50570000000',
    icon: WhatsAppIcon
  }
];

export function Footer() {
  return (
    <footer className="bg-anthracite border-t border-gray-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="text-2xl font-bold text-white-soft hover:text-rosso transition-colors duration-200"
            >
              Grupo Rosso
            </Link>
            <p className="mt-4 text-gray-neutral text-sm leading-relaxed">
              Tu tienda especializada en accesorios automotrices de alta calidad. 
              Encuentra todo lo que necesitas para personalizar y mejorar tu vehículo.
            </p>
            
            {/* Redes sociales */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-neutral hover:text-rosso transition-colors duration-200"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Enlaces de navegación */}
          {footerSections.map((section) => (
            <div key={section.title} className="">
              <h3 className="text-white-soft font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-neutral hover:text-rosso transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Línea separadora y copyright */}
        <div className="mt-12 pt-8 border-t border-gray-dark">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-neutral text-sm">
              © {currentYear} Grupo Rosso. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/politicas"
                className="text-gray-neutral hover:text-rosso transition-colors duration-200 text-sm"
              >
                Políticas de Privacidad
              </Link>
              <Link
                href="/terminos"
                className="text-gray-neutral hover:text-rosso transition-colors duration-200 text-sm"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}