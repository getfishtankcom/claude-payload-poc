/**
 * @description
 * Root layout for the public-facing frontend under the [locale] segment.
 * Validates the locale, loads messages, and wraps children with
 * NextIntlClientProvider for bilingual support.
 *
 * Key features:
 * - Inter font loaded via next/font/google with all required weights
 * - Server component — fetches CMS data at request time
 * - Validates locale from [locale] route param
 * - Wraps children with NextIntlClientProvider for client-side translations
 * - html lang attribute set dynamically from locale
 *
 * @dependencies
 * - next/font/google: Font loading and optimization
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
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'

import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getNavigation, getFooter, getSearchConfig } from '@/lib/payload-helpers'
import { routing } from '@/i18n/routing'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'FRAS Canada — Financial Reporting & Assurance Standards',
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

  // Fetch navigation, footer, search config, and messages in parallel
  const [navigation, footer, searchConfig, messages] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getSearchConfig(locale),
    getMessages(),
  ])

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-page text-text-primary font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader
            navigation={navigation}
            popularTags={searchConfig?.popular_tags as { label: string; query: string; id?: string }[] | null | undefined}
          />
          <main data-testid="main-content">{children}</main>
          <SiteFooter footer={footer} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
