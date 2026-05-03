/**
 * Clerk localization overrides for the public auth pages.
 *
 * Clerk's <SignIn> defaults to "Sign in to <App name>" where the app
 * name comes from the Clerk Dashboard. Until that's configured (and
 * for defence-in-depth), we override the title here so visitors see
 * the brand instead of "My Application" (#88 / QA-018).
 *
 * Clerk v7 only accepts `localization` on <ClerkProvider>, not on
 * individual <SignIn> components — keep this constant colocated with
 * the provider, not the page.
 */
import { BRAND } from '@/config/brand'

export const RAS_CLERK_LOCALIZATION = {
  signIn: {
    start: {
      title: `Sign in to ${BRAND.name}`,
      subtitle: 'Welcome back — sign in to continue to your account',
    },
  },
} as const
