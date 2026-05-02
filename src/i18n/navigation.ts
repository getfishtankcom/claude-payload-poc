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
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
