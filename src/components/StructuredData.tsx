/**
 * @description
 * JSON-LD structured data components for SEO.
 * Renders Organization schema on homepage and BreadcrumbList on interior pages.
 *
 * @dependencies
 * - None (pure server components with JSON-LD script tags)
 *
 * @notes
 * - Organization schema: homepage only (Google Rich Results)
 * - BreadcrumbList: all interior pages with breadcrumb trail
 * - Uses Next.js script tag pattern for JSON-LD injection
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

/** Organization structured data for the homepage */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FRAS Canada',
    alternateName: 'Financial Reporting & Assurance Standards Canada',
    url: BASE_URL,
    description:
      'FRAS Canada serves the public interest by establishing high-quality accounting, auditing, and sustainability standards for Canada.',
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    sameAs: ['https://www.linkedin.com/company/fras-canada'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Breadcrumb structured data for interior pages */
type BreadcrumbItem = {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
