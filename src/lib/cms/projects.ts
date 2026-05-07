/**
 * Project queries. `getProjectBySlug` carries an FR→EN slug-fallback because
 * Payload's `fallback: true` covers GETs but not WHERE clauses, and project
 * slugs are localized text — a `where: { slug: { equals } }` against FR
 * misses any project whose FR slug isn't seeded yet (issue #198 / QA-210).
 */
import type { Project } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getProjectsByBoard(
  boardId: number,
  limit = 20,
  locale: PayloadLocale = 'en',
): Promise<Project[]> {
  return withPayload<Project[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'projects',
        where: { board: { equals: boardId } },
        sort: 'title',
        limit,
        depth: 2,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getAllActiveProjects(locale: PayloadLocale = 'en'): Promise<Project[]> {
  return withPayload<Project[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'projects',
        where: { status: { equals: 'Active' } },
        sort: 'title',
        limit: 200,
        depth: 2,
        locale,
      })
      return result.docs
    },
    [],
  )
}

/**
 * Find a project by slug, falling back to the EN slug when the requested
 * locale returns nothing. Step-2 errors are swallowed defensively — worst
 * case the caller gets `null` and renders notFound().
 */
export async function getProjectBySlug(
  projectSlug: string,
  locale: PayloadLocale = 'en',
): Promise<Project | null> {
  return withPayload<Project | null>(
    async (payload) => {
      const primary = await payload.find({
        collection: 'projects',
        where: { slug: { equals: projectSlug } },
        limit: 1,
        depth: 3,
        locale,
      })
      if (primary.docs[0]) return primary.docs[0]

      if (locale !== 'en') {
        try {
          const fallback = await payload.find({
            collection: 'projects',
            where: { slug: { equals: projectSlug } },
            limit: 1,
            depth: 0,
            locale: 'en',
          })
          const fallbackDoc = fallback.docs[0]
          if (fallbackDoc) {
            const localized = await payload.findByID({
              collection: 'projects',
              id: fallbackDoc.id,
              depth: 3,
              locale,
            })
            return localized ?? fallbackDoc
          }
        } catch {
          // Fallback path failed; fall through to null.
        }
      }
      return null
    },
    null,
  )
}
