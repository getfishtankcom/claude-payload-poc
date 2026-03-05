/**
 * @description
 * Effective dates table for standards sections (Template 10).
 * Complex nested table with purple section headers, alternating rows,
 * footnotes, and print-friendly styles.
 *
 * Key features:
 * - Purple section header rows (purple bg, white text) spanning full width
 * - Two columns: Application (~65%) and Pronouncement (~35%)
 * - Alternating white/light gray row backgrounds
 * - Dashed borders between rows within sections
 * - Footnotes at bottom with superscript markers
 * - Mobile: single column stacked layout
 * - Print-friendly: @media print prevents row breaks across pages
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Rich text fields (application, introText, footnote text) rendered as dangerouslySetInnerHTML
 *   In production, these would use Payload's Lexical serializer
 * - For now, we accept string HTML for the rich text fields
 */

export type EffectiveDateRow = {
  application: string
  pronouncement?: string
  footnoteRef?: string
}

export type EffectiveDateSection = {
  headerLabel: string
  headerDate?: string
  rows: EffectiveDateRow[]
}

export type EffectiveDateFootnote = {
  marker: string
  text: string
}

export type EffectiveDatesTableProps = {
  /** Intro text displayed above the table */
  introText?: string
  /** Grouped sections with purple headers */
  sections: EffectiveDateSection[]
  /** Footnotes displayed below the table */
  footnotes?: EffectiveDateFootnote[]
}

export function EffectiveDatesTable({
  introText,
  sections,
  footnotes,
}: EffectiveDatesTableProps) {
  if (!sections || sections.length === 0) {
    return (
      <p className="py-4 text-sm italic text-text-muted">
        No effective dates data available.
      </p>
    )
  }

  return (
    <div data-testid="effective-dates-table">
      {/* Intro text */}
      {introText && (
        <div
          className="mb-6 overflow-x-auto text-sm italic text-text-primary prose prose-sm prose-a:text-link"
          dangerouslySetInnerHTML={{ __html: introText }}
        />
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse print:break-inside-avoid">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="w-[65%] py-3 pr-6 text-left text-sm font-bold text-text-primary">
                Application
              </th>
              <th className="w-[35%] py-3 text-left text-sm font-bold text-text-primary">
                Pronouncement
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, sectionIndex) => (
              <DesktopSection
                key={`section-${sectionIndex}`}
                section={section}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked layout */}
      <div className="md:hidden space-y-0">
        {sections.map((section, sectionIndex) => (
          <MobileSection key={`mobile-section-${sectionIndex}`} section={section} />
        ))}
      </div>

      {/* Footnotes */}
      {footnotes && footnotes.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-4" data-testid="effective-dates-footnotes">
          {footnotes.map((footnote) => (
            <p key={footnote.marker} className="mb-2 text-xs text-text-muted">
              <sup className="mr-1 font-semibold">{footnote.marker}</sup>
              <span dangerouslySetInnerHTML={{ __html: footnote.text }} />
            </p>
          ))}
        </div>
      )}

      {/* Print styles — applied via className on the table and inline styles on tr */}
    </div>
  )
}

/** Desktop section: purple header row + data rows */
function DesktopSection({ section }: { section: EffectiveDateSection }) {
  return (
    <>
      {/* Purple header row */}
      <tr>
        <td
          colSpan={2}
          className="py-3 px-4 text-sm font-bold text-white"
          style={{ backgroundColor: 'rgb(96, 31, 91)' }}
        >
          {section.headerLabel}
          {section.headerDate && (
            <span className="ml-1">
              {new Date(section.headerDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </td>
      </tr>
      {/* Data rows */}
      {section.rows.map((row, rowIndex) => (
        <tr
          key={`row-${rowIndex}`}
          className={`${
            rowIndex % 2 === 1 ? 'bg-row-alt' : 'bg-white'
          } ${rowIndex < section.rows.length - 1 ? 'border-b border-dashed border-gray-300' : 'border-b border-gray-200'}`}
          style={{ breakInside: 'avoid' }}
        >
          <td className="py-3 pr-6 align-top">
            <div
              className="text-sm text-text-primary prose prose-sm prose-a:text-link"
              dangerouslySetInnerHTML={{ __html: row.application }}
            />
            {row.footnoteRef && (
              <sup className="ml-0.5 text-xs font-semibold text-primary">
                {row.footnoteRef}
              </sup>
            )}
          </td>
          <td className="py-3 align-top text-sm text-text-primary">
            {row.pronouncement}
          </td>
        </tr>
      ))}
    </>
  )
}

/** Mobile section: purple header + stacked cards */
function MobileSection({ section }: { section: EffectiveDateSection }) {
  return (
    <div className="mb-0">
      {/* Purple header */}
      <div
        className="py-3 px-4 text-sm font-bold text-white"
        style={{ backgroundColor: 'rgb(96, 31, 91)' }}
      >
        {section.headerLabel}
        {section.headerDate && (
          <span className="ml-1">
            {new Date(section.headerDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
      </div>
      {/* Stacked rows */}
      {section.rows.map((row, rowIndex) => (
        <div
          key={`mobile-row-${rowIndex}`}
          className={`px-4 py-3 ${
            rowIndex % 2 === 1 ? 'bg-row-alt' : 'bg-white'
          } ${rowIndex < section.rows.length - 1 ? 'border-b border-dashed border-gray-300' : 'border-b border-gray-200'}`}
        >
          <div
            className="mb-2 overflow-x-auto text-sm text-text-primary prose prose-sm prose-a:text-link"
            dangerouslySetInnerHTML={{ __html: row.application }}
          />
          {row.footnoteRef && (
            <sup className="text-xs font-semibold text-primary">
              {row.footnoteRef}
            </sup>
          )}
          {row.pronouncement && (
            <p className="mt-2 text-sm">
              <span className="font-medium text-text-muted">Pronouncement: </span>
              {row.pronouncement}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
