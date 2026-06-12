import type { MetadataRoute } from 'next'

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/admin/', '/login', '/signup', '/dashboard', '/profile', '/cdn-cgi/', '/app/', '/*-untitled/'],
    },
    sitemap: 'https://smartassfacts.com/sitemap.xml',
    host: 'https://smartassfacts.com',
  }
}
