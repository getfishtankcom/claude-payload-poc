/**
 * @description
 * Next.js configuration wrapped with Payload CMS plugin.
 * The withPayload wrapper ensures compatibility with Payload's
 * server-side dependencies (drizzle-kit, sharp, etc.).
 *
 * @dependencies
 * - @payloadcms/next: Provides withPayload wrapper
 */
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opt out of static generation for Payload admin routes
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
