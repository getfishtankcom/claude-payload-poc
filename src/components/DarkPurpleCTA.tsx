/**
 * @description
 * Dark purple CTA block for the "How to Reply" section on document detail pages.
 * Full-width dark background with white text, heading, body, mailing address,
 * email link, and submit button.
 *
 * Key features:
 * - Dark purple/near-black background (~rgb(50, 20, 50))
 * - H3 heading, instruction paragraph, contact details
 * - Email rendered as mailto link
 * - CTA button with white text
 * - Full width on desktop and mobile
 *
 * @dependencies
 * - RichText: For rendering rich text body and address content
 *
 * @notes
 * - Server component — no client-side interactivity
 * - All fields are CMS-driven via props
 */
import { RichText } from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type DarkPurpleCTAProps = {
  /** CTA section heading */
  heading: string
  /** Instruction body text (rich text) */
  body: SerializedEditorState | Record<string, unknown> | null | undefined
  /** Button label */
  ctaLabel: string
  /** Button link URL */
  ctaHref: string
  /** Contact person name */
  contactName?: string
  /** Contact person title */
  contactTitle?: string
  /** Contact mailing address (rich text for multi-line) */
  contactAddress?: SerializedEditorState | Record<string, unknown> | null | undefined
  /** Contact email address */
  contactEmail?: string
  className?: string
}

export function DarkPurpleCTA({
  heading,
  body,
  ctaLabel,
  ctaHref,
  contactName,
  contactTitle,
  contactAddress,
  contactEmail,
  className = '',
}: DarkPurpleCTAProps) {
  return (
    <div
      className={`rounded-sm bg-[rgb(50,20,50)] px-6 py-8 text-white sm:px-8 ${className}`.trim()}
      data-testid="dark-purple-cta"
    >
      {/* Heading */}
      <h3 className="text-xl font-bold text-white">{heading}</h3>

      {/* Body text */}
      {body && (
        <RichText
          content={body}
          className="mt-3 text-sm leading-relaxed text-white/90 [&_a]:text-white [&_a]:underline"
        />
      )}

      {/* Contact details */}
      {(contactName || contactTitle || contactAddress || contactEmail) && (
        <div className="mt-4 space-y-1 text-sm text-white/90">
          {contactName && <p className="font-semibold text-white">{contactName}</p>}
          {contactTitle && <p>{contactTitle}</p>}
          {contactAddress && (
            <RichText
              content={contactAddress}
              className="[&_p]:text-sm [&_p]:text-white/90"
            />
          )}
          {contactEmail && (
            <p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-white underline hover:text-white/80"
                data-testid="dark-purple-cta-email"
              >
                {contactEmail}
              </a>
            </p>
          )}
        </div>
      )}

      {/* CTA Button */}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center rounded-sm border-2 border-white px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors duration-150"
        data-testid="dark-purple-cta-button"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
