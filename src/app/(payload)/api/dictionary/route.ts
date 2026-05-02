/**
 * Public read-only dictionary endpoint.
 *
 * Returns all published terms; the GlossaryTooltip caches the response
 * client-side so a single fetch covers a whole page render.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'dictionary',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })

    const terms = result.docs.map((d) => {
      const doc = d as unknown as Record<string, unknown>
      return {
        id: doc.id,
        term: doc.term,
        termFr: doc.termFr,
        definition: doc.definition,
        definitionFr: doc.definitionFr,
        category: doc.category,
      }
    })

    const response = NextResponse.json({ terms, total: terms.length })
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
