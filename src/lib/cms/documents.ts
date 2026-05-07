/**
 * Document workflow queries — open consultations, all consultations, the
 * documents-for-comment listing, and the document-detail lookup with its
 * `-dfc` slug-fallback (the listing slug and the paired detail slug don't
 * always match in the legacy seed; see test fixture for the contract).
 */
import type { Where } from 'payload'
import type { Consultation, DocumentDetail, DocumentsForComment } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getOpenConsultations(
  locale: PayloadLocale = 'en',
): Promise<Consultation[]> {
  return withPayload<Consultation[]>(
    async (payload) => {
      const now = new Date().toISOString()
      const result = await payload.find({
        collection: 'consultations',
        where: { deadline_date: { greater_than: now } },
        sort: 'deadline_date',
        limit: 100,
        depth: 2,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getAllConsultations(
  locale: PayloadLocale = 'en',
): Promise<Consultation[]> {
  return withPayload<Consultation[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'consultations',
        sort: 'deadline_date',
        limit: 200,
        depth: 2,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getDocumentsForComment(
  status?: 'open' | 'closed',
): Promise<DocumentsForComment[]> {
  return withPayload<DocumentsForComment[]>(
    async (payload) => {
      const where: Where = {}
      if (status) where.status = { equals: status }
      const result = await payload.find({
        collection: 'documents-for-comment',
        where,
        sort: 'sortOrder',
        limit: 200,
        depth: 2,
      })
      return result.docs
    },
    [],
  )
}

/**
 * Find the detail page for a documents-for-comment listing slug.
 *
 * Direct match first. When that misses, fall back to the paired record via
 * `howToReply.ctaHref` (which embeds the dfc slug) — stripped of its
 * trailing `-dfc` so closed-document ctaHrefs (which point at the comments
 * PDF, not /submit-comment/...) still match.
 */
export async function getDocumentDetailBySlug(slug: string): Promise<DocumentDetail | null> {
  return withPayload<DocumentDetail | null>(
    async (payload) => {
      const direct = await payload.find({
        collection: 'document-details',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
      })
      if (direct.docs[0]) return direct.docs[0]

      const stripped = slug.replace(/-dfc$/, '')
      const fallback = await payload.find({
        collection: 'document-details',
        where: { 'howToReply.ctaHref': { contains: stripped } },
        limit: 1,
        depth: 2,
      })
      return fallback.docs[0] ?? null
    },
    null,
  )
}
