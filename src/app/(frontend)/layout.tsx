/**
 * @description
 * Root layout for the public-facing frontend.
 * Fetches navigation and footer globals from Payload CMS and passes
 * them as props to SiteHeader and SiteFooter.
 *
 * Key features:
 * - Inter font loaded via next/font/google with all required weights
 * - Server component — fetches CMS data at request time
 * - Passes navigation data to SiteHeader (client component)
 * - Passes footer data to SiteFooter
 *
 * @dependencies
 * - next/font/google: Font loading and optimization
 * - globals.css: Design tokens + Tailwind base styles
 * - SiteHeader: Global header component (client component)
 * - SiteFooter: Global footer component
 * - payload-helpers: CMS data fetching
 *
 * @notes
 * - This is an async server component (fetches CMS data)
 * - Navigation and footer fetch in parallel for performance
 * - If CMS is unavailable, components render empty states
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getNavigation, getFooter, getSearchConfig } from '@/lib/payload-helpers'

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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  // Fetch navigation, footer, and search config in parallel
  const [navigation, footer, searchConfig] = await Promise.all([
    getNavigation(),
    getFooter(),
    getSearchConfig(),
  ])

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page text-text-primary font-sans antialiased">
        <SiteHeader navigation={navigation} popularTags={searchConfig?.popular_tags} />
        <main data-testid="main-content">{children}</main>
        <SiteFooter footer={footer} />
      </body>
    </html>
  )
}
