/**
 * @description
 * Locale-aware navigation utilities for next-intl.
 * Wraps Next.js Link, usePathname, useRouter, and redirect
 * with automatic locale prefix handling.
 *
 * Key features:
 * - Link: Locale-prefixed <a> tags
 * - usePathname: Returns path without locale prefix
 * - useRouter: Router with locale parameter support
 * - redirect: Server-side redirect with locale
 *
 * @dependencies
 * - next-intl/navigation: createNavigation
 * - ./routing: routing config
 *
 * @notes
 * - Import Link, usePathname, useRouter, redirect from this file
 *   instead of next/link or next/navigation for locale-aware behavior
 */
import { createNavigation } from 'next-intl/navigation'
import type { ComponentProps } from 'react'
import { routing } from './routing'

const nav = createNavigation(routing)

/**
 * Typed Link for the typed-pathnames API. Accepts a strict union of
 * known pathnames or `{ pathname, params }` objects.
 */
export const TypedLink = nav.Link

/**
 * Loose-typed Link wrapper.
 *
 * next-intl's typed pathnames enforce a strict union of known routes on
 * `<Link href>`, which conflicts with our many dynamic template-string
 * hrefs (`/news/${slug}`, `/${board}/about/members`, etc.). The runtime
 * locale-prefix + FR pathname-alias behavior is independent of the
 * compile-time check, so we re-export `Link` accepting any string href.
 *
 * Static aliased routes (`/active-projects` → `/fr/projets-actifs`) still
 * resolve correctly at runtime via the `routing.pathnames` map.
 */
type LooseLinkProps = Omit<ComponentProps<typeof nav.Link>, 'href'> & {
  href: string
}
export const Link = nav.Link as unknown as React.ComponentType<LooseLinkProps>

export const { redirect, usePathname, useRouter, getPathname } = nav
