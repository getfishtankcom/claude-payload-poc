/**
 * @description
 * Member card for board member listings (Template 4).
 * Displays portrait photo, name as purple link, credentials,
 * role label (for officers), and appointment dates.
 *
 * Key features:
 * - Photo at 205x205px using next/image
 * - Name is purple link to bio page
 * - Role label (CHAIR, VICE-CHAIR) as uppercase bold for officers only
 * - Formatted appointment and term expiration dates
 *
 * @dependencies
 * - next/image for optimized photo rendering
 *
 * @notes
 * - Props match Payload CMS board-members collection fields
 * - Role label only shows for chair/vice-chair roles
 * - Date formatting uses Intl.DateTimeFormat
 */
import Image from 'next/image'

export type MemberCardProps = {
  member: {
    name: string
    credentials?: string
    photo?: string
    role: string
    roleLabel?: string
    appointedDate?: string
    termExpires?: string
    bioPageUrl?: string
  }
}

/** Format an ISO date string to "January 1, 2023" */
function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(isoDate))
  } catch {
    return isoDate
  }
}

export function MemberCard({ member }: MemberCardProps) {
  const isOfficer = member.role === 'chair' || member.role === 'vice-chair'
  const displayRoleLabel =
    member.roleLabel || (member.role === 'chair' ? 'CHAIR' : member.role === 'vice-chair' ? 'VICE-CHAIR' : '')

  return (
    <div data-testid="member-card" className="space-y-2">
      {/* Photo */}
      <div className="relative h-[180px] w-[180px] overflow-hidden bg-gray-100 sm:h-[205px] sm:w-[205px]">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Portrait of ${member.name}`}
            width={205}
            height={205}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-text-muted">
            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Name — purple link */}
      {member.bioPageUrl ? (
        <a
          href={member.bioPageUrl}
          className="block text-sm font-semibold text-link hover:underline"
          data-testid="member-name-link"
        >
          {member.name}
        </a>
      ) : (
        <p className="text-sm font-semibold text-link">{member.name}</p>
      )}

      {/* Credentials */}
      {member.credentials && (
        <p className="text-xs text-text-muted">{member.credentials}</p>
      )}

      {/* Role label — uppercase bold for officers only */}
      {isOfficer && displayRoleLabel && (
        <p className="text-xs font-bold uppercase text-text-primary">
          {displayRoleLabel}
        </p>
      )}

      {/* Dates */}
      {member.appointedDate && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Appointed:</span>{' '}
          {formatDate(member.appointedDate)}
        </p>
      )}
      {member.termExpires && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Term Expires:</span>{' '}
          {formatDate(member.termExpires)}
        </p>
      )}
    </div>
  )
}
