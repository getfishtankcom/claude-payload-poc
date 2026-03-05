/**
 * @description
 * Root layout for the public-facing frontend.
 * Loads Inter font via next/font/google with all required weights
 * (300 Light, 400 Regular, 600 Semi-Bold, 700 Bold, 900 Black).
 * Renders SiteHeader + main content + SiteFooter on every page.
 *
 * @dependencies
 * - next/font/google: Font loading and optimization
 * - globals.css: Design tokens + Tailwind base styles
 * - SiteHeader: Global header component
 * - SiteFooter: Global footer component
 *
 * @notes
 * - Inter is the wireframe-specified font (replacing Roboto from live site)
 * - Metadata will be expanded with proper SEO fields in later epics
 * - SiteHeader and SiteFooter wrap all frontend pages
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

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

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page text-text-primary font-sans antialiased">
        <SiteHeader />
        <main data-testid="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
