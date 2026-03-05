/**
 * @description
 * Next.js configuration wrapped with Payload CMS and next-intl plugins.
 * The withPayload wrapper ensures compatibility with Payload's
 * server-side dependencies (drizzle-kit, sharp, etc.).
 * createNextIntlPlugin handles message file bundling for i18n.
 *
 * @dependencies
 * - @payloadcms/next: Provides withPayload wrapper
 * - next-intl/plugin: Provides createNextIntlPlugin for message bundling
 */
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opt out of static generation for Payload admin routes
  experimental: {
    reactCompiler: false,
  },
  // Redirect root / to default locale /en (middleware can't intercept / with Payload)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ]
  },
}

export default withPayload(withNextIntl(nextConfig))
