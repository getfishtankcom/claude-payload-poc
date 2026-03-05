/**
 * @description
 * Robots.txt configuration at /robots.txt.
 * Allows all crawlers, blocks admin panel, references sitemap.
 *
 * @notes
 * - Next.js convention: app/robots.ts generates /robots.txt
 * - Blocks /admin and /api routes from indexing
 * - References auto-generated sitemap
 */
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
