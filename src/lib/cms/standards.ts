/**
 * Standards queries — the standards collection plus the standards-sections
 * groupings (IFRS, Sustainability, ASPE, etc.) and effective-date lookups.
 */
import type { EffectiveDate, Standard, StandardsSection } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getStandardsByCategory(
  locale: PayloadLocale = 'en',
): Promise<Record<string, Standard[]>> {
  return withPayload<Record<string, Standard[]>>(
    async (payload) => {
      const result = await payload.find({
        collection: 'standards',
        limit: 100,
        sort: 'title',
        locale,
      })
      const grouped: Record<string, Standard[]> = {}
      for (const standard of result.docs) {
        const category = standard.category || 'Uncategorized'
        if (!grouped[category]) grouped[category] = []
        grouped[category].push(standard)
      }
      return grouped
    },
    {},
  )
}

export async function getAllStandards(locale: PayloadLocale = 'en'): Promise<Standard[]> {
  return withPayload<Standard[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'standards',
        limit: 100,
        sort: 'name',
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getStandardsSectionBySlug(
  slug: string,
): Promise<StandardsSection | null> {
  return withPayload<StandardsSection | null>(
    async (payload) => {
      const result = await payload.find({
        collection: 'standards-sections',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 3,
      })
      return result.docs[0] ?? null
    },
    null,
  )
}

export async function getAllStandardsSections(): Promise<StandardsSection[]> {
  return withPayload<StandardsSection[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'standards-sections',
        limit: 20,
        sort: 'title',
      })
      return result.docs
    },
    [],
  )
}

export async function getEffectiveDatesByStandard(
  standardSlug: string,
): Promise<EffectiveDate | null> {
  return withPayload<EffectiveDate | null>(
    async (payload) => {
      const standardResult = await payload.find({
        collection: 'standards',
        where: { slug: { equals: standardSlug } },
        limit: 1,
      })
      const standard = standardResult.docs[0]
      if (!standard) return null

      const result = await payload.find({
        collection: 'effective-dates',
        where: { standard: { equals: standard.id } },
        limit: 1,
        depth: 2,
      })
      return result.docs[0] ?? null
    },
    null,
  )
}

export async function getAllStandardsSlugs(): Promise<string[]> {
  return withPayload<string[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'standards',
        limit: 100,
        depth: 0,
      })
      return result.docs.map((s) => s.slug ?? '').filter(Boolean)
    },
    [],
  )
}
