import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Grupo Rosso - Accesorios Automotrices Premium',
  description: 'Tienda especializada en accesorios automotrices de alta calidad. Encuentra filtros, sistemas de escape, tapetes, sistemas de audio y más para tu vehículo.',
  keywords: 'accesorios auto, filtros K&N, sistemas escape Borla, tapetes WeatherTech, audio Pioneer, tuning, performance',
  authors: [{ name: 'Grupo Rosso' }],
  creator: 'MiniMax Agent',
  publisher: 'Grupo Rosso',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_NI',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Grupo Rosso',
    title: 'Grupo Rosso - Accesorios Automotrices Premium',
    description: 'Tienda especializada en accesorios automotrices de alta calidad.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Grupo Rosso - Accesorios Automotrices'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grupo Rosso - Accesorios Automotrices Premium',
    description: 'Tienda especializada en accesorios automotrices de alta calidad.',
    images: ['/images/og-image.jpg']
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  themeColor: '#C1121F'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-anthracite text-white-soft antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}