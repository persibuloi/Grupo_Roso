import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/carrito',
        '/*?*', // Evitar indexar URLs con parámetros de query
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}