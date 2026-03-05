/**
 * @description
 * GraphQL endpoint for Payload CMS.
 * Handles POST requests to /graphql for GraphQL queries and mutations.
 *
 * @dependencies
 * - @payloadcms/next: Provides GRAPHQL_POST handler
 */
import { GRAPHQL_POST } from '@payloadcms/next/routes'
import config from '@payload-config'

export const POST = GRAPHQL_POST(config)
