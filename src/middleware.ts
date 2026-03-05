/**
 * @description
 * Combined middleware: Clerk auth + next-intl locale routing.
 * Clerk's clerkMiddleware() wraps the next-intl locale handler,
 * ensuring auth state is available on all frontend routes.
 *
 * @dependencies
 * - @clerk/nextjs/server: clerkMiddleware, createRouteMatcher
 * - next-intl/middleware: createMiddleware
 * - ./i18n/routing: locale routing config
 *
 * @notes
 * - Payload CMS admin routes (/admin, /api) are excluded from both middlewares
 * - Clerk runs first, then next-intl handles locale detection/redirect
 * - Protected routes (my-account/*) require sign-in via Clerk
 */
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

// Routes that require authentication (member-only forms, not the login page itself)
const isProtectedRoute = createRouteMatcher([
  '/:locale/my-account/dashboard(.*)',
  '/:locale/my-account/profile(.*)',
  '/:locale/my-account/preferences(.*)',
])

// Public auth pages — login, register, forgot-password render Clerk components inline
// These are NOT protected so the page can render before auth redirects

export default clerkMiddleware(async (auth, req) => {
  // Protect member-only routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Run next-intl middleware for locale handling
  return intlMiddleware(req)
})

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
