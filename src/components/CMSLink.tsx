/**
 * @description
 * Renders a CMS-configured link from the reusable link() field.
 * Handles both internal references (to Payload collections) and external URLs.
 * Maps the appearance field to Button component variants.
 *
 * Key features:
 * - Internal links use Next.js Link for client-side navigation
 * - External links open in new tab when configured
 * - Appearance maps to Button variants (default, outline, ghost)
 * - Falls back to a plain anchor if no appearance is set
 *
 * @dependencies
 * - next/link for internal navigation
 * - Button from ui components for styled link rendering
 *
 * @notes
 * - Follows Payload website template CMSLink pattern
 * - Reference links resolve to page slugs
 * - Used by hero links, CTA blocks, and content blocks
 */
import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui'

type CMSLinkProps = {
  appearance?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?: {
    value: string | { slug?: string; id?: string }
    relationTo: string
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  className?: string
  children?: React.ReactNode
}

export const CMSLink: React.FC<CMSLinkProps> = ({
  appearance,
  children,
  className,
  label,
  newTab,
  reference,
  type,
  url: customUrl,
}) => {
  // Resolve the href based on link type
  let href = ''
  if (type === 'reference' && reference?.value) {
    const refValue = reference.value
    if (typeof refValue === 'string') {
      href = `/${refValue}`
    } else if (refValue.slug) {
      href = `/${refValue.slug}`
    }
  } else if (type === 'custom' && customUrl) {
    href = customUrl
  }

  if (!href) return null

  const content = children || label
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  // Map appearance to Button variant
  if (appearance === 'outline') {
    return (
      <Button variant="secondary" href={href} className={className} {...newTabProps}>
        {content}
      </Button>
    )
  }

  if (appearance === 'ghost') {
    return (
      <Button variant="ghost" href={href} className={className} {...newTabProps}>
        {content}
      </Button>
    )
  }

  if (appearance === 'default') {
    return (
      <Button variant="primary" href={href} className={className} {...newTabProps}>
        {content}
      </Button>
    )
  }

  // No appearance — render as plain link
  return (
    <Link href={href} className={className} {...newTabProps}>
      {content}
    </Link>
  )
}
