/**
 * @description
 * Main Payload CMS configuration file.
 * Defines the database adapter (PostgreSQL via Drizzle),
 * rich text editor (Lexical), collections, and admin settings.
 *
 * @dependencies
 * - payload: Core CMS framework
 * - @payloadcms/db-postgres: PostgreSQL adapter via Drizzle ORM
 * - @payloadcms/richtext-lexical: Lexical rich text editor
 * - sharp: Image processing for uploads
 *
 * @notes
 * - Collections are imported from src/collections/
 * - The importMap.baseDir must match the src directory
 * - DATABASE_URI and PAYLOAD_SECRET must be set in .env
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin panel configuration
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // Collections define the data models
  collections: [Users, Media],

  // Rich text editor
  editor: lexicalEditor(),

  // Secret for JWT signing — must be set in .env
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript output for auto-generated types
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Database adapter — PostgreSQL via Drizzle ORM
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // Image processing
  sharp,

  // Plugins will be added as needed (Meilisearch, etc.)
  plugins: [],
})
