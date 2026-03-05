/**
 * @description
 * Root layout for the public-facing frontend.
 * Loads Inter font via next/font/google with all required weights
 * (300 Light, 400 Regular, 600 Semi-Bold, 700 Bold, 900 Black).
 * Imports globals.css which contains the Tailwind v4 @theme inline
 * design token definitions.
 *
 * @dependencies
 * - next/font/google: Font loading and optimization
 * - globals.css: Design tokens + Tailwind base styles
 *
 * @notes
 * - Inter is the wireframe-specified font (replacing Roboto from live site)
 * - Metadata will be expanded with proper SEO fields in later epics
 */
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

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
      <body className="bg-page text-text-primary font-sans antialiased">{children}</body>
    </html>
  )
}
