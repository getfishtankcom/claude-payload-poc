/**
 * @description
 * News Detail page route — `/[locale]/news/[slug]`.
 *
 * Renders a single News item from the `news` collection: breadcrumb,
 * date + category badge, title, optional featured image, and Lexical
 * body via the shared <RichText> serializer.
 *
 * @dependencies
 * - getNewsBySlug, getLatestNews: payload-helpers
 * - <RichText>: shared Lexical→JSX wrapper (Phase 1.1)
 * - <Breadcrumb>: layout breadcrumb component
 *
 * @notes
 * - Listings link here via /news/<slug>; previously 404 (issue #80).
 * - Slug is unique across the news collection; no board scoping needed.
 * - generateStaticParams over all news in the default locale; FR pages
 *   render on demand via Next's per-locale fallback.
 */
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'

import { withLocaleMetadata } from '@/lib/i18n-metadata'
import { getNewsBySlug, toPayloadLocale, getLatestNews } from '@/lib/payload-helpers'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { RichText } from '@/components/RichText'
import type { Media as MediaType } from '@/payload-types'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const news = await getLatestNews(200, 'en')
  return news
    .filter((item) => typeof item.slug === 'string' && item.slug.length > 0)
    .map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const item = await getNewsBySlug(slug, toPayloadLocale(locale))
  if (!item) return { title: 'News — Not Found' }

  return withLocaleMetadata(
    {
      title: `${item.title} — RAS Canada`,
      description: item.excerpt || undefined,
    },
    `/news/${slug}`,
    locale,
  )
}

function formatDate(value: string, locale: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const item = await getNewsBySlug(slug, toPayloadLocale(locale))

  if (!item) notFound()

  const featuredImage = item.featured_image && typeof item.featured_image !== 'number'
    ? (item.featured_image as MediaType)
    : null

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news-listings' },
    { label: item.title, href: `/news/${slug}` },
  ]

  return (
    <article className="mx-auto max-w-[840px] px-4 py-10 sm:px-6 lg:px-8" data-testid="page-news-detail">
      <Breadcrumb items={breadcrumbItems} />

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
          <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
          {item.category && (
            <span
              className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-text-secondary"
              data-testid="news-category-badge"
            >
              {item.category}
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{item.title}</h1>
        {item.excerpt && (
          <p className="mt-4 text-lg text-text-muted">{item.excerpt}</p>
        )}
      </header>

      {featuredImage?.url && (
        <div className="mt-8 overflow-hidden rounded-lg" data-testid="news-featured-image">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || item.title}
            width={featuredImage.width || 1200}
            height={featuredImage.height || 675}
            className="h-auto w-full"
            priority
          />
        </div>
      )}

      <RichText
        content={item.body}
        className="prose prose-lg mt-8 max-w-none text-text-primary"
      />

      <div className="mt-12 border-t border-gray-200 pt-6 text-sm">
        <Link href="/news-listings" className="text-primary hover:underline">
          ← Back to all news
        </Link>
      </div>
    </article>
  )
}
