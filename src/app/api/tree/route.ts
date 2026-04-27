/**
 * @description
 * Tree API endpoint for the admin content tree.
 *
 * - GET /api/tree — returns full nested tree from root pages (parent=null)
 * - GET /api/tree?parentId=X — returns direct children of node X (lazy-load)
 *
 * Implementation:
 * Single bulk fetch of all pages (limit:0). Nodes are grouped into a
 * parent → children map in memory; hasChildren is derived from that map.
 * No N+1 count queries, no recursive fetches.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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

/** Normalize a Payload doc (parent/board may be a relationship object) into a TreeNode shape. */
function toTreeNode(doc: Record<string, unknown>): TreeNode {
  const parentField = doc.parent as { id?: string | number } | string | number | null | undefined
  const parentId =
    parentField && typeof parentField === 'object' && parentField !== null
      ? (parentField.id ?? null)
      : ((parentField as string | number | null | undefined) ?? null)

  const boardField = doc.board as { id?: string | number } | string | number | null | undefined
  const boardId =
    boardField && typeof boardField === 'object' && boardField !== null
      ? (boardField.id ?? null)
      : ((boardField as string | number | null | undefined) ?? null)

  return {
    id: doc.id as string | number,
    title: (doc.title as string) || 'Untitled',
    slug: (doc.slug as string) || '',
    contentType: (doc.contentType as string) || 'page',
    workflowState: (doc.workflowState as string) || 'draft',
    lockedBy: (doc.lockedBy as string | number | null) || null,
    sortOrder: (doc.sortOrder as number) || 0,
    parent: parentId,
    board: boardId,
    hasChildren: false,
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl
    const parentIdParam = searchParams.get('parentId')

    // Single bulk fetch — limit:0 returns ALL matching pages.
    const result = await payload.find({
      collection: 'pages',
      limit: 0,
      depth: 1,
      sort: 'sortOrder',
    })

    // Build in-memory parent → children map.
    const nodesById = new Map<string | number, TreeNode>()
    const childrenByParent = new Map<string | number | 'ROOT', TreeNode[]>()

    for (const doc of result.docs) {
      const node = toTreeNode(doc as unknown as Record<string, unknown>)
      nodesById.set(node.id, node)
      const key: string | number | 'ROOT' = node.parent ?? 'ROOT'
      const bucket = childrenByParent.get(key)
      if (bucket) {
        bucket.push(node)
      } else {
        childrenByParent.set(key, [node])
      }
    }

    // Mark hasChildren on every node from the parent map.
    for (const node of nodesById.values()) {
      node.hasChildren = childrenByParent.has(node.id)
    }

    // Lazy-load mode: return only direct children of parentId.
    if (parentIdParam) {
      const numericId = Number.isNaN(Number(parentIdParam)) ? parentIdParam : Number(parentIdParam)
      const children =
        childrenByParent.get(parentIdParam) ?? childrenByParent.get(numericId) ?? []
      // Clone without children arrays so the client can lazy-fetch deeper levels.
      const flat = children.map((c) => ({ ...c }))
      return NextResponse.json({ nodes: flat, total: flat.length })
    }

    // Full tree mode: build nested structure starting from root nodes.
    const attachChildren = (node: TreeNode): TreeNode => {
      const kids = childrenByParent.get(node.id) ?? []
      return {
        ...node,
        children: kids.length > 0 ? kids.map(attachChildren) : undefined,
      }
    }

    const roots = (childrenByParent.get('ROOT') ?? []).map(attachChildren)
    return NextResponse.json({ nodes: roots, total: result.totalDocs })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
