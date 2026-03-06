/**
 * @description
 * Tree search API endpoint for deep search across all tree items (Epic 23).
 * Searches title and slug fields, returns matching items with their
 * ancestor chain so the tree UI can auto-expand parents.
 *
 * Key features:
 * - GET /api/tree/search?q=IFRS — searches all pages by title/slug
 * - Returns matching items plus their ancestor IDs for tree expansion
 * - Case-insensitive partial matching
 *
 * @dependencies
 * - payload: Local API for querying pages collection
 *
 * @notes
 * - Used by the tree search bar for "deep search" (server-side)
 * - Client-side search handles filtering already-expanded nodes
 * - Ancestor chain computed by walking parent references up to root
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface SearchResult {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: string
  parent: string | number | null
  /** IDs of all ancestors from root to this item's parent */
  ancestorIds: (string | number)[]
}

/**
 * Walk the parent chain to collect all ancestor IDs for auto-expanding the tree.
 */
async function getAncestorIds(
  payload: Awaited<ReturnType<typeof getPayload>>,
  parentId: string | number | null,
  visited: Set<string | number> = new Set(),
): Promise<(string | number)[]> {
  if (!parentId) return []
  // Guard against circular references
  if (visited.has(parentId)) return []
  visited.add(parentId)

  const parent = await payload.findByID({
    collection: 'pages',
    id: parentId,
    depth: 0,
    select: { parent: true },
  })

  const grandparentId = (parent?.parent as string | number) || null
  const ancestors = await getAncestorIds(payload, grandparentId, visited)
  return [...ancestors, parentId]
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], expandIds: [] })
    }

    // Search pages by title or slug (case-insensitive contains)
    const result = await payload.find({
      collection: 'pages',
      where: {
        or: [
          { title: { contains: query } },
          { slug: { contains: query } },
        ],
      },
      limit: 50,
      depth: 0,
      select: {
        title: true,
        slug: true,
        contentType: true,
        workflowState: true,
        parent: true,
      },
    })

    // Collect all ancestor IDs for auto-expanding tree paths
    const allAncestorIds = new Set<string | number>()
    const results: SearchResult[] = await Promise.all(
      result.docs.map(async (doc) => {
        const parentId = (doc.parent as string | number) || null
        const ancestorIds = await getAncestorIds(payload, parentId)
        ancestorIds.forEach((id) => allAncestorIds.add(id))

        return {
          id: doc.id,
          title: (doc.title as string) || 'Untitled',
          slug: (doc.slug as string) || '',
          contentType: (doc.contentType as string) || 'page',
          workflowState: (doc.workflowState as string) || 'draft',
          parent: parentId,
          ancestorIds,
        }
      }),
    )

    return NextResponse.json({
      results,
      /** All node IDs that should be expanded to reveal search results */
      expandIds: Array.from(allAncestorIds),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
