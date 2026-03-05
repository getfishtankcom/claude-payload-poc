/**
 * @description
 * Auto-generated sitemap at /sitemap.xml.
 * Includes all static pages and dynamic routes from CMS,
 * with locale-prefixed URLs and hreflang alternates for EN/FR.
 *
 * @dependencies
 * - payload-helpers: for fetching boards, projects, standards
 * - i18n/routing: locale configuration
 *
 * @notes
 * - Next.js convention: app/sitemap.ts generates /sitemap.xml
 * - Dynamic routes: boards, projects (active only)
 * - Static routes: homepage, active-projects, open-consultations, search
 * - Excludes admin routes
 * - Each URL includes alternates for both EN and FR locales
 */
import type { MetadataRoute } from 'next'
import { getAllBoards, getAllActiveProjects } from '@/lib/payload-helpers'
import { locales } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

/** Build hreflang alternates map for a given pathname */
function buildAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = `${BASE_URL}/${locale}${pathname}`
  }
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages — generate one entry per locale with alternates
  const staticPaths = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/active-projects', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/open-consultations', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/search', changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: buildAlternates(path) },
    })),
  )

  // Dynamic board pages (exclude RASOC — no board detail page)
  const boards = await getAllBoards()
  const boardRoutes: MetadataRoute.Sitemap = boards
    .filter((b) => b.slug !== 'rasoc')
    .flatMap((board) => {
      const path = `/boards/${board.slug}`
      return locales.map((locale) => ({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: { languages: buildAlternates(path) },
      }))
    })

  // Dynamic project pages
  const projects = await getAllActiveProjects()
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project) => {
    const boardSlug = typeof project.board === 'object' ? project.board?.slug : ''
    const path = `/active-projects/${boardSlug}/${project.slug}`
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: { languages: buildAlternates(path) },
    }))
  })

  return [...staticRoutes, ...boardRoutes, ...projectRoutes]
}
