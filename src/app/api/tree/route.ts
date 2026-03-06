/**
 * @description
 * Tree API endpoint for the admin content tree (Epic 23).
 * Returns hierarchical tree data from the `pages` collection using the
 * `parent` self-referential relationship.
 *
 * Key features:
 * - GET /api/tree — returns full tree from root nodes (parent=null)
 * - GET /api/tree?parentId=X — returns only children of node X (lazy-load)
 * - Response includes: id, title, slug, contentType, workflowState,
 *   lockedBy, hasChildren, sortOrder, parent, board
 *
 * @dependencies
 * - payload: Local API for querying pages collection
 *
 * @notes
 * - Tree nodes are pages with parent=null at root level
 * - hasChildren is computed by checking if any page has parent=thisId
 * - Sorted by sortOrder ascending within each level
 * - Used by the admin ContentTree component at /admin/tree
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Shape of a tree node returned by the API */
interface TreeNode {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: string
  lockedBy: string | number | null
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  board: string | number | null
  children?: TreeNode[]
}

/**
 * Fetches tree nodes at a given level (children of parentId, or root nodes if null).
 * Recursively fetches children to build nested structure when no parentId filter is specified.
 */
async function fetchTreeLevel(
  payload: Awaited<ReturnType<typeof getPayload>>,
  parentId: string | number | null,
  recursive: boolean,
): Promise<TreeNode[]> {
  // Build the where clause for parent filtering
  const where = parentId
    ? { parent: { equals: parentId } }
    : { parent: { exists: false } }

  const result = await payload.find({
    collection: 'pages',
    where,
    sort: 'sortOrder',
    limit: 500,
    depth: 0,
    select: {
      title: true,
      slug: true,
      contentType: true,
      workflowState: true,
      lockedBy: true,
      sortOrder: true,
      parent: true,
      board: true,
    },
  })

  // For each node, check if it has children
  const nodes: TreeNode[] = await Promise.all(
    result.docs.map(async (doc) => {
      const childCount = await payload.count({
        collection: 'pages',
        where: { parent: { equals: doc.id } },
      })

      const node: TreeNode = {
        id: doc.id,
        title: (doc.title as string) || 'Untitled',
        slug: (doc.slug as string) || '',
        contentType: (doc.contentType as string) || 'page',
        workflowState: (doc.workflowState as string) || 'draft',
        lockedBy: (doc.lockedBy as string | number) || null,
        hasChildren: childCount.totalDocs > 0,
        sortOrder: (doc.sortOrder as number) || 0,
        parent: (doc.parent as string | number) || null,
        board: (doc.board as string | number) || null,
      }

      // Recursively fetch children for full tree (when no parentId filter)
      if (recursive && node.hasChildren) {
        node.children = await fetchTreeLevel(payload, doc.id, true)
      }

      return node
    }),
  )

  return nodes
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl
    const parentId = searchParams.get('parentId')

    if (parentId) {
      // Lazy-load: return only direct children of the specified parent
      const children = await fetchTreeLevel(payload, parentId, false)
      return NextResponse.json({ nodes: children })
    }

    // Full tree: return nested structure from root
    const tree = await fetchTreeLevel(payload, null, true)
    return NextResponse.json({ nodes: tree })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
