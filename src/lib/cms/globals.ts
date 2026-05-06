/**
 * Payload globals: site-wide singletons (homepage, navigation, footer, branding,
 * search-config, auth-config). All return null when not yet populated; callers
 * should render a sensible empty state.
 */
import type { AuthConfig, Footer, Homepage, Navigation, SearchConfig } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getHomepage(locale: PayloadLocale = 'en'): Promise<Homepage | null> {
  return withPayload<Homepage | null>(
    (payload) => payload.findGlobal({ slug: 'homepage', locale }),
    null,
  )
}

export async function getNavigation(locale: PayloadLocale = 'en'): Promise<Navigation | null> {
  return withPayload<Navigation | null>(
    (payload) => payload.findGlobal({ slug: 'navigation', locale }),
    null,
  )
}

export async function getFooter(locale: PayloadLocale = 'en'): Promise<Footer | null> {
  return withPayload<Footer | null>(
    (payload) => payload.findGlobal({ slug: 'footer', locale }),
    null,
  )
}

/**
 * Branding global. Returns just the populated-logo shape that the header,
 * footer, and admin login mark consume — kept narrow on purpose so callers
 * can't depend on incidental CMS fields. Falls back to the text wordmark
 * when null.
 */
export type BrandingLogo = {
  logo?: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
}

export async function getBranding(locale: PayloadLocale = 'en'): Promise<BrandingLogo | null> {
  return withPayload<BrandingLogo | null>(
    async (payload) => {
      const branding = await payload.findGlobal({ slug: 'branding', locale, depth: 1 })
      return branding as unknown as BrandingLogo
    },
    null,
  )
}

export async function getSearchConfig(locale: PayloadLocale = 'en'): Promise<SearchConfig | null> {
  return withPayload<SearchConfig | null>(
    (payload) => payload.findGlobal({ slug: 'search-config', locale }),
    null,
  )
}

export async function getAuthConfig(): Promise<AuthConfig | null> {
  return withPayload<AuthConfig | null>(
    (payload) => payload.findGlobal({ slug: 'auth-config' }),
    null,
  )
}
