/**
 * @description
 * Custom 404 page with brand styling, header/footer, and home CTA.
 * Renders when Next.js can't find a matching route.
 *
 * Key features:
 * - Brand colors and typography
 * - "Back to Home" CTA button
 * - Minimal layout, no sidebar
 * - Includes SiteHeader and SiteFooter (via root layout)
 *
 * @dependencies
 * - Button: CTA component
 * - Container: Max-width wrapper
 *
 * @notes
 * - This file lives at app/not-found.tsx (root level for all routes)
 * - Header/footer come from the parent layout
 */
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { routing } from '@/i18n/routing'

/**
 * Resolve the request locale for the 404 view. Next.js doesn't pass
 * params to not-found.tsx, so pull the locale from the URL via the
 * x-pathname header (set by `next-intl/middleware`). Falls back to the
 * default locale if anything looks wrong.
 */
async function resolveLocale(): Promise<'en' | 'fr'> {
  const h = await headers()
  // next-intl middleware exposes the resolved locale on this header.
  const fromHeader = h.get('x-next-intl-locale')
  if (fromHeader === 'en' || fromHeader === 'fr') return fromHeader

  // Fallback: parse the first path segment of the request URL.
  const path = h.get('x-pathname') || h.get('next-url') || ''
  const seg = path.split('/').filter(Boolean)[0]
  if (seg === 'en' || seg === 'fr') return seg
  return routing.defaultLocale as 'en' | 'fr'
}

export default async function NotFound() {
  const locale = await resolveLocale()
  const t = await getTranslations({ locale, namespace: 'errors' })
  return (
    <Container as="main" variant="narrow" className="py-20 md:py-32">
      <div
        data-testid="page-404"
        className="flex flex-col items-center gap-6 text-center"
      >
        <p className="text-6xl font-black text-primary md:text-8xl">404</p>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          {t('404.title')}
        </h1>
        <p className="max-w-md text-base text-text-secondary">
          {t('404.description')}
        </p>
        <Button href="/" variant="primary" size="lg">
          {t('404.backHome')}
        </Button>
      </div>
    </Container>
  )
}
