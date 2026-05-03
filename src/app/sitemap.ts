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
 * - Dynamic routes: boards, projects (active only), standards, effective-dates
 * - Static routes: homepage, active-projects, open-consultations, search,
 *   contact-us, job-opportunities, news-listings
 * - Excludes admin routes
 * - Each URL includes alternates for both EN and FR locales
 */
import type { MetadataRoute } from 'next'
import { getActiveBoards, getAllActiveProjects, getAllStandardsSections } from '@/lib/payload-helpers'
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
    // Phase 2 static routes
    { path: '/contact-us', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/job-opportunities', changeFrequency: 'weekly' as const, priority: 0.5 },
    { path: '/news-listings', changeFrequency: 'daily' as const, priority: 0.7 },
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

  // Dynamic board pages (exclude RASOC — no board detail page; #78).
  const nonOversightBoards = await getActiveBoards()

  const boardRoutes: MetadataRoute.Sitemap = nonOversightBoards.flatMap((board) => {
    const path = `/boards/${board.slug}`
    return locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: buildAlternates(path) },
    }))
  })

  // Phase 2: Board sub-pages (members, committees, meetings-and-events, etc.)
  const boardSubPages = ['about/members', 'committees', 'meetings-and-events', 'news-listings', 'resources', 'documents']
  const boardSubRoutes: MetadataRoute.Sitemap = nonOversightBoards.flatMap((board) =>
    boardSubPages.flatMap((sub) => {
      const path = `/${board.slug}/${sub}`
      return locales.map((locale) => ({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: { languages: buildAlternates(path) },
      }))
    }),
  )

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

  // Phase 2: Standards sections + effective dates
  const standardsSections = await getAllStandardsSections()
  const standardsRoutes: MetadataRoute.Sitemap = standardsSections.flatMap((section) => {
    const slug = section.slug as string
    const overviewPath = `/standards/${slug}`
    const effectiveDatesPath = `/standards/${slug}/effective-dates`
    return [
      ...locales.map((locale) => ({
        url: `${BASE_URL}/${locale}${overviewPath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: { languages: buildAlternates(overviewPath) },
      })),
      ...locales.map((locale) => ({
        url: `${BASE_URL}/${locale}${effectiveDatesPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: { languages: buildAlternates(effectiveDatesPath) },
      })),
    ]
  })

  return [
    ...staticRoutes,
    ...boardRoutes,
    ...boardSubRoutes,
    ...projectRoutes,
    ...standardsRoutes,
  ]
}
