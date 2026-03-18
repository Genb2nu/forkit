import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://forkit.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/create', '/saved', '/profile/*/edit'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
