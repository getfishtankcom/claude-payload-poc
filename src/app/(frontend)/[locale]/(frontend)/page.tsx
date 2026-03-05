/**
 * @description
 * Homepage route — the main landing page at `/`.
 * Server component that fetches the homepage global from Payload CMS
 * and renders it via RenderHero + RenderBlocks architecture.
 *
 * Key features:
 * - Fetches homepage global (hero + layout blocks) from CMS
 * - Uses RenderHero for the hero section (gradient, search bar, etc.)
 * - Uses RenderBlocks for the page body (CTA, news grid, browse by standard, etc.)
 * - Empty state handling when CMS has no data configured
 * - Page metadata for SEO
 *
 * @dependencies
 * - payload-helpers: getHomepage() for CMS data fetching
 * - RenderHero: Hero type discriminator
 * - RenderBlocks: Block type → component mapper
 *
 * @notes
 * - All user-facing content comes from CMS — no hardcoded strings
 * - Homepage global has hero group + layout blocks (configured in admin)
 * - If homepage global is not configured, renders empty state
 */
import type { Metadata } from 'next'
import { getHomepage, toPayloadLocale } from '@/lib/payload-helpers'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { OrganizationSchema } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: "FRAS Canada — Canada's Official Hub for Financial Reporting Standards",
  description:
    'FRAS provides resources and guidance to help professionals navigate Canadian accounting, auditing, and sustainability standards. Home of AcSB, PSAB, AASB, and CSSB.',
  openGraph: {
    title: "FRAS Canada — Canada's Official Hub for Financial Reporting Standards",
    description:
      'FRAS provides resources and guidance to help professionals navigate Canadian accounting, auditing, and sustainability standards.',
    type: 'website',
  },
}

/** Revalidate every 60s — ISR for CMS-driven content */
export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const homepage = await getHomepage(toPayloadLocale(locale))

  // Empty state when homepage global is not configured
  if (!homepage) {
    return (
      <main data-testid="page-homepage" className="min-h-screen">
        <div className="flex items-center justify-center py-24">
          <p className="text-text-muted">Homepage content not configured.</p>
        </div>
      </main>
    )
  }

  return (
    <main data-testid="page-homepage" className="min-h-screen">
      <OrganizationSchema />
      <RenderHero {...homepage.hero} />
      <RenderBlocks blocks={homepage.layout} />
    </main>
  )
}
