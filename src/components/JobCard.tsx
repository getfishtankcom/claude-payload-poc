/**
 * @description
 * Job listing card for Template 17 (job opportunities page).
 * Displays job title, department/location, posted date, summary, and CTA.
 *
 * Key features:
 * - Title as prominent text
 * - Department/location + posted date on same line (desktop)
 * - Summary paragraph
 * - "View Details" CTA link
 * - Hover: subtle background change + left border accent
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Props match Payload CMS job-postings collection fields
 * - externalUrl opens in new tab; internal links use same tab
 */

export type JobCardProps = {
  job: {
    title: string
    department?: string
    location?: string
    postedDate?: string
    summary?: string
    externalUrl?: string
    slug?: string
  }
}

function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoDate))
  } catch {
    return isoDate
  }
}

export function JobCard({ job }: JobCardProps) {
  const detailUrl = job.externalUrl || (job.slug ? `/job-opportunities/${job.slug}` : '#')
  const isExternal = !!job.externalUrl

  return (
    <div
      data-testid="job-card"
      className="border-b border-gray-200 px-4 py-5 transition-colors hover:border-l-4 hover:border-l-primary hover:bg-gray-50"
    >
      <h3 className="text-base font-bold text-text-primary">{job.title}</h3>

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
        {(job.department || job.location) && (
          <span>
            {[job.department, job.location].filter(Boolean).join(' / ')}
          </span>
        )}
        {job.postedDate && <span>Posted: {formatDate(job.postedDate)}</span>}
      </div>

      {job.summary && (
        <p className="mt-2 text-sm text-text-primary">{job.summary}</p>
      )}

      <a
        href={detailUrl}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        View Details
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  )
}
