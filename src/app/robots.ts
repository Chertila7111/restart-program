import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cabinet', '/checkout', '/api/', '/auth/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru',
  }
}
