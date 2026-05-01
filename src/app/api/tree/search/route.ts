/**
 * @description
 * Tree search API endpoint — deep search across all tree items.
 *
 * GET /api/tree/search?q=... — case-insensitive partial match against
 * title and slug, returns matching items with their full ancestor chain
 * so the client tree can auto-expand parents.
 *
 * Implementation:
 * Single bulk fetch of all pages (limit:0). Builds an in-memory id→node
 * map, walks parent pointers entirely in memory to resolve ancestor
 * chains. No N+1 findByID calls in the result loop.
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
  /** IDs of all ancestors from root → this item's parent. */
  ancestorIds: (string | number)[]
  /** Full ancestor records for breadcrumbing. */
  ancestors: Array<{ id: string | number; title: string; slug: string }>
}

interface IndexedPage {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: string
  parent: string | number | null
}

function normalizeRel(value: unknown): string | number | null {
  if (value && typeof value === 'object' && 'id' in (value as Record<string, unknown>)) {
    const id = (value as { id?: string | number }).id
    return id ?? null
  }
  return (value as string | number | null | undefined) ?? null
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = request.nextUrl
    const query = (searchParams.get('q') ?? '').trim()

    if (query.length === 0) {
      return NextResponse.json({ results: [], expandIds: [], total: 0 })
    }

    // Single bulk fetch — used both for searching and for ancestor lookups.
    const result = await payload.find({
      collection: 'pages',
      limit: 0,
      depth: 1,
    })

    // Build indexed map of every page in one pass.
    const byId = new Map<string | number, IndexedPage>()
    for (const doc of result.docs) {
      const d = doc as unknown as Record<string, unknown>
      byId.set(d.id as string | number, {
        id: d.id as string | number,
        title: (d.title as string) || 'Untitled',
        slug: (d.slug as string) || '',
        contentType: (d.contentType as string) || 'page',
        workflowState: (d.workflowState as string) || 'draft',
        parent: normalizeRel(d.parent),
      })
    }

    // Filter to matching pages (case-insensitive partial match on title/slug).
    const needle = query.toLowerCase()
    const matches: IndexedPage[] = []
    for (const page of byId.values()) {
      if (page.title.toLowerCase().includes(needle) || page.slug.toLowerCase().includes(needle)) {
        matches.push(page)
      }
    }

    // Resolve ancestor chains entirely from the in-memory map.
    const allAncestorIds = new Set<string | number>()
    const results: SearchResult[] = matches.map((page) => {
      const ancestorIds: (string | number)[] = []
      const ancestors: Array<{ id: string | number; title: string; slug: string }> = []
      let currentParent = page.parent
      const seen = new Set<string | number>()
      while (currentParent != null && !seen.has(currentParent)) {
        seen.add(currentParent)
        const parentNode = byId.get(currentParent)
        if (!parentNode) break
        ancestorIds.unshift(parentNode.id)
        ancestors.unshift({ id: parentNode.id, title: parentNode.title, slug: parentNode.slug })
        allAncestorIds.add(parentNode.id)
        currentParent = parentNode.parent
      }
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        contentType: page.contentType,
        workflowState: page.workflowState,
        parent: page.parent,
        ancestorIds,
        ancestors,
      }
    })

    return NextResponse.json({
      results,
      total: results.length,
      /** All node IDs that should be expanded to reveal search results. */
      expandIds: Array.from(allAncestorIds),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
