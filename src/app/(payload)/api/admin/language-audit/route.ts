/**
 * GET /api/admin/language-audit?collection=...&board=...&status=...
 *
 * Returns translation status for content items across pages, news, and
 * projects. Each item has FR status: translated / partial / missing.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const AUDITED_COLLECTIONS = ['pages', 'news', 'projects'] as const
type AuditCollection = typeof AUDITED_COLLECTIONS[number]
type FrStatus = 'translated' | 'partial' | 'missing'

interface AuditItem {
  id: string | number
  title: string
  collection: AuditCollection
  board?: { title?: string; slug?: string } | null
  frStatus: FrStatus
  updatedAt?: string
}

function statusFor(en: Record<string, unknown>, fr: Record<string, unknown>): FrStatus {
  const frTitle = (fr.title as string) ?? ''
  const enTitle = (en.title as string) ?? ''
  if (!frTitle || frTitle === enTitle) return 'missing'
  // Heuristic: count localized text fields to decide partial vs translated.
  const localizedKeys = ['title', 'description', 'subtitle', 'summary', 'body']
  let translated = 0
  let total = 0
  for (const key of localizedKeys) {
    if (en[key] != null && en[key] !== '') {
      total++
      if (fr[key] != null && fr[key] !== '' && fr[key] !== en[key]) translated++
    }
  }
  if (total === 0) return 'translated'
  if (translated === total) return 'translated'
  if (translated === 0) return 'missing'
  return 'partial'
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl
    const collectionFilter = searchParams.get('collection') as AuditCollection | null
    const statusFilter = searchParams.get('status') as FrStatus | 'all' | null
    const boardFilter = searchParams.get('board')

    const collections = collectionFilter
      ? [collectionFilter].filter((c): c is AuditCollection => AUDITED_COLLECTIONS.includes(c))
      : Array.from(AUDITED_COLLECTIONS)

    const fetched = await Promise.allSettled(
      collections.map(async (slug) => {
        const where = boardFilter
          ? { board: { equals: boardFilter } }
          : undefined
        const [enResult, frResult] = await Promise.all([
          payload.find({ collection: slug, locale: 'en', limit: 500, depth: 1, where }),
          payload.find({ collection: slug, locale: 'fr', limit: 500, depth: 0, where }),
        ])
        const frById = new Map<string | number, Record<string, unknown>>()
        for (const f of frResult.docs) {
          frById.set((f as { id: string | number }).id, f as unknown as Record<string, unknown>)
        }
        return enResult.docs.map((doc) => {
          const en = doc as unknown as Record<string, unknown>
          const fr = (frById.get(en.id as string | number) ?? {}) as Record<string, unknown>
          const item: AuditItem = {
            id: en.id as string | number,
            title: (en.title as string) || `${slug} item`,
            collection: slug,
            board: (en.board as { title?: string; slug?: string } | null) ?? null,
            frStatus: statusFor(en, fr),
            updatedAt: (en.updatedAt as string) ?? undefined,
          }
          return item
        })
      }),
    )

    const items = fetched.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    const filtered = statusFilter && statusFilter !== 'all'
      ? items.filter((i) => i.frStatus === statusFilter)
      : items

    // Build summary counts per collection.
    const summary: Record<string, { total: number; translated: number; partial: number; missing: number }> = {}
    for (const c of AUDITED_COLLECTIONS) {
      summary[c] = { total: 0, translated: 0, partial: 0, missing: 0 }
    }
    for (const item of items) {
      const s = summary[item.collection]
      s.total++
      s[item.frStatus]++
    }

    return NextResponse.json({ items: filtered, summary, total: filtered.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
