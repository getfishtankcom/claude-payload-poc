/**
 * @description
 * Staff contact card for right-sidebar display on content pages (Template 3A).
 * Renders purple "Staff Contact(s)" heading with contact details including
 * phone (tel: link) and email (mailto: link) with icons.
 *
 * Key features:
 * - Purple H2 heading using brand primary color rgb(96, 31, 91)
 * - Phone and email as clickable links with icon prefixes
 * - Multiple contacts separated by visual dividers
 * - Sticky positioning handled by parent layout
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Props match Payload CMS contacts collection field shapes
 * - No default text values — all content from CMS
 * - Multiple contacts supported with HR dividers between them
 */

export type StaffContactProps = {
  /** Array of staff contacts to display */
  contacts: Array<{
    name: string
    title: string
    phone: string
    email: string
  }>
}

export function StaffContactCard({ contacts }: StaffContactProps) {
  if (!contacts || contacts.length === 0) {
    return null
  }

  return (
    <div data-testid="staff-contact-card" className="rounded-sm border border-gray-200 bg-white p-6">
      <h2
        className="mb-4 text-lg font-bold"
        style={{ color: 'rgb(96, 31, 91)' }}
      >
        Staff Contact{contacts.length > 1 ? 's' : ''}
      </h2>

      {contacts.map((contact, index) => (
        <div key={contact.email}>
          {index > 0 && <hr className="my-4 border-gray-200" />}

          <div className="space-y-1">
            <p className="font-bold text-text-primary">{contact.name}</p>
            <p className="text-sm text-text-muted">{contact.title}</p>

            {contact.phone && (
              <p className="flex items-center gap-2 text-sm">
                <svg
                  className="h-4 w-4 shrink-0 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-link underline-offset-2 hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
            )}

            {contact.email && (
              <p className="flex items-center gap-2 text-sm">
                <svg
                  className="h-4 w-4 shrink-0 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-link underline-offset-2 hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
