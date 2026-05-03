/**
 * @description
 * Root layout for the public-facing frontend under the [locale] segment.
 * Validates the locale, loads messages, and wraps children with
 * NextIntlClientProvider and ClerkProvider for bilingual + auth support.
 *
 * Key features:
 * - Inter font loaded via next/font/google with all required weights
 * - Server component — fetches CMS data at request time
 * - Validates locale from [locale] route param
 * - ClerkProvider wraps everything for auth state
 * - NextIntlClientProvider for client-side translations
 * - html lang attribute set dynamically from locale
 *
 * @dependencies
 * - next/font/google: Font loading and optimization
 * - @clerk/nextjs: ClerkProvider
 * - next-intl: NextIntlClientProvider, hasLocale
 * - next-intl/server: getMessages
 * - globals.css: Design tokens + Tailwind base styles
 * - SiteHeader: Global header component (client component)
 * - SiteFooter: Global footer component
 * - payload-helpers: CMS data fetching
 * - i18n/routing: Locale validation
 *
 * @notes
 * - This is an async server component (fetches CMS data + messages)
 * - Navigation and footer fetch in parallel for performance
 * - If CMS is unavailable, components render empty states
 * - Invalid locales trigger Next.js 404 via notFound()
 * - Clerk uses keyless mode — no env vars needed for dev
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { RAS_CLERK_LOCALIZATION } from '@/lib/clerk-localization'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'

import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getNavigation, getFooter, getSearchConfig, toPayloadLocale } from '@/lib/payload-helpers'
import { routing } from '@/i18n/routing'
import { BRAND } from '@/config/brand'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
})

// Default metadata for any route under [locale] that doesn't export its
// own `generateMetadata`. Pulls the brand string from BRAND so the
// legacy "Financial Reporting & Assurance Standards" copy can never
// sneak back in via a stale string. The `template` lets every page
// that does export `generateMetadata` provide a leading title segment
// that gets " — RAS Canada" appended automatically. (#149 / QA-101)
export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description:
    'The standard-setting body for all accountants across Canada. Home of AcSB, PSAB, AASB, and CSSB.',
}

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function FrontendLayout({ children, params }: LayoutProps) {
  // Validate the incoming locale
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Fetch navigation, footer, search config, and messages in parallel.
  // Pass `locale` explicitly to getMessages — the project doesn't call
  // setRequestLocale anywhere, and without it next-intl's request context
  // can fall through to the default locale on FR routes, which would feed
  // the EN dictionary into NextIntlClientProvider and leak EN strings into
  // every client component that reads from useTranslations. (#77)
  const [navigation, footer, searchConfig, messages] = await Promise.all([
    getNavigation(toPayloadLocale(locale)),
    getFooter(toPayloadLocale(locale)),
    getSearchConfig(toPayloadLocale(locale)),
    getMessages({ locale }),
  ])

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-page text-text-primary font-sans antialiased">
        <ClerkProvider localization={RAS_CLERK_LOCALIZATION}>
          {/* Hand the locale to the client provider so useTranslations
              picks the right dictionary in every descendant. */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SiteHeader
              navigation={navigation}
              popularTags={searchConfig?.popular_tags as { label: string; query: string; id?: string }[] | null | undefined}
            />
            <main data-testid="main-content">{children}</main>
            <SiteFooter footer={footer} locale={locale} />
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
