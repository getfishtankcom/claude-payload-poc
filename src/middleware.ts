/**
 * @description
 * Next.js middleware for locale detection and routing.
 * Uses next-intl's createMiddleware to handle:
 * - Redirecting bare URLs (/) to default locale (/en/)
 * - Detecting user's preferred locale from Accept-Language header
 * - Setting NEXT_LOCALE cookie for preference persistence
 *
 * @dependencies
 * - next-intl/middleware: createMiddleware
 * - ./i18n/routing: routing configuration
 *
 * @notes
 * - Excludes /admin, /api, /_next, /_vercel, and static files
 * - Payload CMS admin routes are NOT locale-prefixed
 * - Matcher pattern ensures middleware only runs on frontend routes
 */
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all frontend pathnames, exclude:
  // - /api (Payload API routes)
  // - /admin (Payload admin panel)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /trpc (if used)
  // - Files with extensions (favicon.ico, robots.txt, etc.)
  matcher: '/((?!api|admin|_next|_vercel|trpc|.*\\..*).*)',
}
