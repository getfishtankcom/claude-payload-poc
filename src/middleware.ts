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
import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { findRedirect } from './lib/redirects'

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
  // Check redirects collection FIRST so 301/302s short-circuit before
  // running Clerk/intl middleware. Cached in-memory with a 5-min TTL.
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? req.nextUrl.origin
  const rule = await findRedirect(req.nextUrl.pathname, serverUrl).catch(() => null)
  if (rule) {
    const isAbsolute = /^https?:\/\//i.test(rule.to)
    if (isAbsolute) {
      // Defence against open-redirect: only follow same-origin absolute URLs.
      try {
        const target = new URL(rule.to)
        const origin = new URL(serverUrl)
        if (target.host === origin.host) {
          return NextResponse.redirect(target.toString(), rule.type === '302' ? 302 : 301)
        }
        // Cross-origin redirect — refuse silently and continue middleware chain.
      } catch {
        // Malformed `to` URL — fall through.
      }
    } else {
      const target = new URL(rule.to, req.nextUrl.origin).toString()
      return NextResponse.redirect(target, rule.type === '302' ? 302 : 301)
    }
  }

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
  matcher: '/((?!api|admin|cms|_next|_vercel|trpc|.*\\..*).*)',
}
