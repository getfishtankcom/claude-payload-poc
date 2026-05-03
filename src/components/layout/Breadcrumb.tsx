/**
 * @description
 * Breadcrumb navigation component that auto-generates from route path
 * or accepts custom override items. Uses semantic HTML with <nav> + <ol>.
 *
 * Features:
 * - Auto-generates from current URL pathname when no items prop provided
 * - Splits path segments, capitalizes, converts slugs to readable labels
 * - First item always "Home" linking to "/"
 * - Last item rendered as plain text (current page)
 * - Accessible with aria-label and aria-current
 *
 * @dependencies
 * - next/link: Client-side navigation
 * - next/navigation: usePathname for auto-generation
 *
 * @notes
 * - Client component because usePathname requires client-side rendering
 * - Separator uses ">" chevron character
 * - Wraps naturally on small screens
 */
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  /** Optional manual breadcrumb items (overrides auto-generation).
      Callers should NOT include a leading Home entry — the component
      always prepends a localized Home crumb. Legacy callers passing
      `{ label: 'Home', href: '/' }` as the first item are tolerated:
      that entry is stripped and replaced with the localized version
      so we don't render two Home crumbs. */
  items?: BreadcrumbItem[]
  className?: string
}

/**
 * Converts a URL slug segment to a readable label.
 * Example: 'active-projects' -> 'Active Projects'
 */
function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Auto-generates breadcrumb items from a URL pathname (without Home —
 * the component prepends the localized Home crumb itself).
 */
function generateFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1

    items.push({
      label: slugToLabel(segment),
      href: isLast ? undefined : href,
    })
  })

  return items
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const t = useTranslations('breadcrumb')
  const pathname = usePathname()
  const provided = items ?? generateFromPath(pathname)

  // Strip a leading Home entry from legacy callers so we never double-render.
  const trail = provided[0]?.label === 'Home' ? provided.slice(1) : provided

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t('home'), href: '/' },
    ...trail,
  ]

  // Don't render breadcrumb on homepage
  if (breadcrumbItems.length <= 1) return null

  return (
    <nav aria-label={t('ariaLabel')} className={`text-sm ${className}`.trim()} data-testid="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <li key={index} className="flex items-center gap-1">
              {/* Separator (not on first item) */}
              {index > 0 && (
                <span className="text-text-muted" aria-hidden="true">
                  &gt;
                </span>
              )}

              {/* Link or plain text */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-primary hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-muted" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
