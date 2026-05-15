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
    sitemap: 'https://restart-program.ru/sitemap.xml',
    host: 'https://restart-program.ru',
  }
}
