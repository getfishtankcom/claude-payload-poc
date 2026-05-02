/**
 * @description
 * TypeScript declarations for environment variables.
 * Provides type safety when accessing process.env values.
 *
 * @notes
 * - Adapted from Payload website template
 * - Only includes vars used in Phase 1. Extend as integrations are added.
 * - NEXT_PUBLIC_ vars are available on client and server
 * - All others are server-only
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URI: string

      // Payload CMS
      PAYLOAD_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string

      // Meilisearch
      MEILISEARCH_HOST: string
      MEILISEARCH_API_KEY: string
      NEXT_PUBLIC_MEILISEARCH_HOST: string
      NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY: string

      // Node
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export {}
