/**
 * @description
 * Job listings component for Template 17 that renders JobCards or EmptyState.
 * Server component — fetches from job-postings collection.
 *
 * Key features:
 * - Fetches published jobs from Payload CMS
 * - Renders JobCard for each active posting
 * - Falls back to EmptyState when no jobs exist
 *
 * @dependencies
 * - JobCard component
 * - EmptyState component
 * - payload-helpers for CMS data fetching
 *
 * @notes
 * - Server component — no 'use client'
 * - Empty state message comes from parent page data (passed as prop)
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { JobCard } from './JobCard'
import { EmptyState } from './EmptyState'

export type JobListingsProps = {
  /** Empty state message (HTML string from CMS) */
  emptyStateMessage?: string
}

export async function JobListings({ emptyStateMessage }: JobListingsProps) {
  let jobs: Array<{
    title: string
    department?: string | null
    location?: string | null
    postedDate?: string | null
    summary?: string | null
    externalUrl?: string | null
    slug?: string
  }> = []

  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'job-postings',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            or: [
              { closingDate: { greater_than: now } },
              { closingDate: { exists: false } },
            ],
          },
        ],
      },
      sort: '-postedDate',
      limit: 50,
    })
    jobs = result.docs as unknown as typeof jobs
  } catch {
    // If CMS is unavailable, show empty state
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        message={
          emptyStateMessage ||
          'Thank you for your interest. Unfortunately, we do not have any open positions at this time. Please check back soon!'
        }
      />
    )
  }

  return (
    <div data-testid="job-listings">
      {jobs.map((job, index) => (
        <JobCard
          key={index}
          job={{
            title: job.title,
            department: job.department || undefined,
            location: job.location || undefined,
            postedDate: job.postedDate || undefined,
            summary: job.summary || undefined,
            externalUrl: job.externalUrl || undefined,
          }}
        />
      ))}
    </div>
  )
}
