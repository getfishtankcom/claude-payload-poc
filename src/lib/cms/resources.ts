/**
 * Paginated resources listing — articles, guidance, webinars, uploaded files.
 * Filters: category, resourceType, date range. Default sort is newest first.
 */
import type { Where } from 'payload'
import type { Resource } from '@/payload-types'
import { withPayload } from './client'

export type ResourcesListingResult = {
  docs: Resource[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getResources(params: {
  category?: string
  resourceType?: string
  sort?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}): Promise<ResourcesListingResult> {
  return withPayload<ResourcesListingResult>(
    async (payload) => {
      const where: Where = { status: { equals: 'published' } }
      if (params.category) where.category = { equals: params.category }
      if (params.resourceType) where.resourceType = { equals: params.resourceType }
      if (params.startDate || params.endDate) {
        const dateFilter: Where[string] = {}
        if (params.startDate) dateFilter.greater_than_equal = params.startDate
        if (params.endDate) dateFilter.less_than_equal = params.endDate
        where.date = dateFilter
      }
      const sortField = params.sort === 'oldest' ? 'date' : '-date'
      const result = await payload.find({
        collection: 'resources',
        where,
        sort: sortField,
        page: params.page || 1,
        limit: params.limit || 10,
        depth: 1,
      })
      return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page || 1,
      }
    },
    { docs: [], totalDocs: 0, totalPages: 0, page: 1 },
  )
}
