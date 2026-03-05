/**
 * @description
 * Catch-all REST API route for Payload CMS.
 * Handles all /api/* requests (CRUD operations on collections, globals, etc.).
 *
 * @dependencies
 * - @payloadcms/next: Provides REST API route handlers
 */
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
