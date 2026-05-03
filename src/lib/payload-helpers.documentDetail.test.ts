import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { findMock } = vi.hoisted(() => ({
  findMock: vi.fn(),
}))

vi.mock('payload', () => ({
  getPayload: vi.fn(async () => ({ find: findMock })),
}))

vi.mock('@payload-config', () => ({ default: {} }))

import { getDocumentDetailBySlug } from './payload-helpers'

describe('getDocumentDetailBySlug', () => {
  beforeEach(() => {
    findMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the direct match when slug is found in document-details', async () => {
    findMock.mockResolvedValueOnce({
      docs: [{ id: 1, slug: 'ed-crypto-assets-dfc', title: 'Crypto' }],
    })

    const doc = await getDocumentDetailBySlug('ed-crypto-assets-dfc')

    expect(doc).toMatchObject({ id: 1, title: 'Crypto' })
    expect(findMock).toHaveBeenCalledTimes(1)
    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'document-details',
        where: { slug: { equals: 'ed-crypto-assets-dfc' } },
      }),
    )
  })

  it('falls back to ctaHref-contains lookup with stripped -dfc suffix when direct lookup misses', async () => {
    findMock
      .mockResolvedValueOnce({ docs: [] }) // direct miss
      .mockResolvedValueOnce({ docs: [{ id: 7, slug: 'dd-crypto-assets', title: 'Crypto Legacy' }] })

    const doc = await getDocumentDetailBySlug('ed-crypto-assets-dfc')

    expect(doc).toMatchObject({ id: 7, title: 'Crypto Legacy' })
    expect(findMock).toHaveBeenCalledTimes(2)
    expect(findMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        collection: 'document-details',
        where: { 'howToReply.ctaHref': { contains: 'ed-crypto-assets' } },
      }),
    )
  })

  it('does not strip when slug has no -dfc suffix', async () => {
    findMock
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 9 }] })

    await getDocumentDetailBySlug('dp-nfp-contributions')

    expect(findMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { 'howToReply.ctaHref': { contains: 'dp-nfp-contributions' } },
      }),
    )
  })

  it('returns null when both lookups miss', async () => {
    findMock
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [] })

    const doc = await getDocumentDetailBySlug('nonexistent-slug')

    expect(doc).toBeNull()
  })

  it('returns null on any thrown error from payload', async () => {
    findMock.mockRejectedValueOnce(new Error('db down'))

    const doc = await getDocumentDetailBySlug('ed-crypto-assets-dfc')

    expect(doc).toBeNull()
  })
})
