/**
 * @description
 * Auto-generated sitemap at /sitemap.xml.
 * Includes all static pages and dynamic routes from CMS.
 *
 * @dependencies
 * - payload-helpers: for fetching boards, projects, standards
 *
 * @notes
 * - Next.js convention: app/sitemap.ts generates /sitemap.xml
 * - Dynamic routes: boards, projects (active only)
 * - Static routes: homepage, active-projects, open-consultations, search
 * - Excludes admin routes
 */
import type { MetadataRoute } from 'next'
import { getAllBoards, getAllActiveProjects } from '@/lib/payload-helpers'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/active-projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/open-consultations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic board pages (exclude RASOC — no board detail page)
  const boards = await getAllBoards()
  const boardRoutes: MetadataRoute.Sitemap = boards
    .filter((b) => b.slug !== 'rasoc')
    .map((board) => ({
      url: `${BASE_URL}/boards/${board.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // Dynamic project pages
  const projects = await getAllActiveProjects()
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const boardSlug = typeof project.board === 'object' ? project.board?.slug : ''
    return {
      url: `${BASE_URL}/active-projects/${boardSlug}/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  })

  return [...staticRoutes, ...boardRoutes, ...projectRoutes]
}
