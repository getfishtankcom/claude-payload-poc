/**
 * @description
 * Support contact information block for the Authentication page.
 * Displays support heading, email (mailto), and phone numbers (tel).
 *
 * Key features:
 * - Support heading (CMS-driven)
 * - Email as mailto link
 * - Toll-free and international phone numbers as tel links
 *
 * @dependencies
 * - None (pure presentational component)
 *
 * @notes
 * - All content from auth-config global
 * - Phone numbers strip whitespace for tel: links
 */
import React from 'react'

type SupportContactBlockProps = {
  heading: string
  email: string
  phoneTollFree: string
  phoneIntl: string
  'data-testid'?: string
}

export function SupportContactBlock({
  heading,
  email,
  phoneTollFree,
  phoneIntl,
  ...props
}: SupportContactBlockProps) {
  return (
    <section
      data-testid={props['data-testid'] || 'support-contact-block'}
      className="flex flex-col gap-3"
    >
      <h2 className="text-lg font-bold text-text-primary">{heading}</h2>
      <div className="flex flex-col gap-1 text-base text-text-secondary">
        <a
          href={`mailto:${email}`}
          className="text-primary hover:text-primary-vivid underline"
        >
          {email}
        </a>
        <p>
          Toll-free:{' '}
          <a
            href={`tel:${phoneTollFree.replace(/[\s()-]/g, '')}`}
            className="text-primary hover:text-primary-vivid underline"
          >
            {phoneTollFree}
          </a>
        </p>
        <p>
          International:{' '}
          <a
            href={`tel:${phoneIntl.replace(/[\s()-]/g, '')}`}
            className="text-primary hover:text-primary-vivid underline"
          >
            {phoneIntl}
          </a>
        </p>
      </div>
    </section>
  )
}
