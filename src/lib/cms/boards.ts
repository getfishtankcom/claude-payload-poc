/**
 * Board / council queries. RASOC is excluded from `getActiveBoards` because
 * per CLAUDE.md "RASOC Rules" it is an oversight council, not a standards
 * board: it never appears in the board nav, the active-projects sidebar,
 * the open-consultations filter, or [board-slug] static params.
 *
 * The exclusion runs on the non-localized `abbreviation` field so it can't
 * drift between locales (the previous slug-keyed filter leaked RASOC into
 * FR routes — see issue #78 / `payload-helpers.activeBoards.test.ts`).
 */
import type { Board } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getBoardBySlug(
  slug: string,
  locale: PayloadLocale = 'en',
): Promise<Board | null> {
  return withPayload<Board | null>(
    async (payload) => {
      const result = await payload.find({
        collection: 'boards',
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
      })
      return result.docs[0] ?? null
    },
    null,
  )
}

/** All boards including RASOC. Used by generateStaticParams + admin filters. */
export async function getAllBoards(locale: PayloadLocale = 'en'): Promise<Board[]> {
  return withPayload<Board[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'boards',
        limit: 100,
        sort: 'name',
        locale,
      })
      return result.docs
    },
    [],
  )
}

/** Standards-setting boards/councils only — RASOC excluded. */
export async function getActiveBoards(locale: PayloadLocale = 'en'): Promise<Board[]> {
  return withPayload<Board[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'boards',
        where: { abbreviation: { not_equals: 'RASOC' } },
        limit: 100,
        sort: 'name',
        locale,
      })
      return result.docs
    },
    [],
  )
}
