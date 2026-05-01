/**
 * @description
 * Media Folders tree API endpoint (Epic 24).
 * Returns hierarchical folder tree data from the `media-folders` collection
 * using the `parent` self-referential relationship.
 *
 * Key features:
 * - GET /api/media-folders/tree — returns full nested folder tree
 * - GET /api/media-folders/tree?parentId=X — returns only children of folder X
 * - Response includes: id, name, hasChildren, sortOrder, parent, children, mediaCount
 *
 * @dependencies
 * - payload: Local API for querying media-folders collection
 *
 * @notes
 * - Follows same pattern as /api/tree (content tree from Epic 23)
 * - mediaCount included for UI display (number of media items in folder)
 * - Used by the admin MediaLibrary component at /admin/media
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Shape of a folder node returned by the API */
interface FolderNode {
  id: string | number
  name: string
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  mediaCount: number
  children?: FolderNode[]
}

/**
 * Fetches folder nodes at a given level (children of parentId, or root folders if null).
 * Recursively fetches children to build nested structure when no parentId filter is specified.
 */
async function fetchFolderLevel(
  payload: Awaited<ReturnType<typeof getPayload>>,
  parentId: string | number | null,
  recursive: boolean,
): Promise<FolderNode[]> {
  const where = parentId
    ? { parent: { equals: parentId } }
    : { parent: { exists: false } }

  const result = await payload.find({
    collection: 'media-folders',
    where,
    sort: 'sortOrder',
    limit: 500,
    depth: 0,
    select: {
      name: true,
      sortOrder: true,
      parent: true,
    },
  })

  const nodes: FolderNode[] = await Promise.all(
    result.docs.map(async (doc) => {
      // Check for child folders and count media items in this folder
      const [childCount, mediaCount] = await Promise.all([
        payload.count({
          collection: 'media-folders',
          where: { parent: { equals: doc.id } },
        }),
        payload.count({
          collection: 'media',
          where: { folder: { equals: doc.id } },
        }),
      ])

      const node: FolderNode = {
        id: doc.id,
        name: (doc.name as string) || 'Untitled',
        hasChildren: childCount.totalDocs > 0,
        sortOrder: (doc.sortOrder as number) || 0,
        parent: (doc.parent as string | number) || null,
        mediaCount: mediaCount.totalDocs,
      }

      if (recursive && node.hasChildren) {
        node.children = await fetchFolderLevel(payload, doc.id, true)
      }

      return node
    }),
  )

  return nodes
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = request.nextUrl
    const parentId = searchParams.get('parentId')

    if (parentId) {
      const children = await fetchFolderLevel(payload, parentId, false)
      return NextResponse.json({ nodes: children })
    }

    const tree = await fetchFolderLevel(payload, null, true)
    return NextResponse.json({ nodes: tree })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
