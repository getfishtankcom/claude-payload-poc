import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findMock } = vi.hoisted(() => ({
  findMock: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ find: findMock })),
}))

vi.mock('@payload-config', () => ({ default: {} }))

import { getActiveBoards } from './payload-helpers'

describe('getActiveBoards', () => {
  beforeEach(() => {
    findMock.mockReset()
  })

  it('queries the boards collection with a where filter excluding the RASOC abbreviation', async () => {
    findMock.mockResolvedValueOnce({
      docs: [
        { id: 1, abbreviation: 'AcSB' },
        { id: 2, abbreviation: 'PSAB' },
        { id: 3, abbreviation: 'AASB' },
        { id: 4, abbreviation: 'CSSB' },
      ],
    })

    const boards = await getActiveBoards('en')

    expect(boards).toHaveLength(4)
    expect(findMock).toHaveBeenCalledTimes(1)
    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'boards',
        where: { abbreviation: { not_equals: 'RASOC' } },
      }),
    )
  })

  it('passes the FR locale through so localized name/slug fields come back in French', async () => {
    findMock.mockResolvedValueOnce({ docs: [] })

    await getActiveBoards('fr')

    expect(findMock).toHaveBeenCalledWith(expect.objectContaining({ locale: 'fr' }))
  })

  it('filter is keyed on the non-localized abbreviation field, so RASOC is excluded on FR too', async () => {
    findMock.mockResolvedValueOnce({ docs: [] })

    await getActiveBoards('fr')

    const callArgs = findMock.mock.calls[0]?.[0] as Record<string, unknown>
    // The whole point of #78 — never re-introduce a slug-keyed filter that
    // would need a per-locale literal to catch the FR RASOC slug.
    expect(callArgs.where).toEqual({ abbreviation: { not_equals: 'RASOC' } })
  })

  it('returns an empty array when Payload throws (defensive)', async () => {
    findMock.mockRejectedValueOnce(new Error('db down'))

    const boards = await getActiveBoards()

    expect(boards).toEqual([])
  })
})
