/**
 * @description
 * Media inquiries contact card block for the Contact Us page.
 * Displays a heading and contact details (name, title, email, phone).
 *
 * Key features:
 * - "Media Inquiries" heading (CMS-driven)
 * - Contact card with name + credentials, title, email (mailto), phone (tel)
 * - All content from CMS (pages.mediaInquiries group fields)
 *
 * @dependencies
 * - None (pure presentational component)
 *
 * @notes
 * - Props match the Payload CMS `pages` collection mediaInquiries group
 * - Email renders as mailto link, phone as tel link
 */
import React from 'react'

type MediaInquiriesBlockProps = {
  heading: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  'data-testid'?: string
}

export function MediaInquiriesBlock({
  heading,
  contactName,
  contactTitle,
  contactEmail,
  contactPhone,
  ...props
}: MediaInquiriesBlockProps) {
  return (
    <section
      data-testid={props['data-testid'] || 'media-inquiries-block'}
      className="rounded-md border border-gray-200 bg-surface-subtle p-6"
    >
      <h2 className="mb-4 text-xl font-bold text-text-primary">{heading}</h2>
      <div className="flex flex-col gap-1 text-base text-text-secondary">
        <p className="font-semibold text-text-primary">{contactName}</p>
        <p>{contactTitle}</p>
        <a
          href={`mailto:${contactEmail}`}
          className="text-primary hover:text-primary-vivid underline"
        >
          {contactEmail}
        </a>
        <a
          href={`tel:${contactPhone.replace(/\s/g, '')}`}
          className="text-primary hover:text-primary-vivid underline"
        >
          {contactPhone}
        </a>
      </div>
    </section>
  )
}
