/**
 * @description
 * Feature CTA block for standards overview pages (Template 5).
 * Renders 1-2 CTA cards side by side with light/dark-purple variants.
 * Hover effect: subtle lift/shadow.
 *
 * Key features:
 * - Light variant: gray background, dark text
 * - Dark-purple variant: purple background, white text
 * - Hover: translateY(-2px) + shadow
 * - Mobile: CTAs stack vertically
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Props come from standards-sections.featureCTAs array
 * - Max 2 cards displayed side by side
 */

export type FeatureCTACard = {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
  variant: 'light' | 'dark-purple'
}

export type FeatureCTABlockProps = {
  /** Array of 1-2 CTA cards */
  cards: FeatureCTACard[]
}

export function FeatureCTABlock({ cards }: FeatureCTABlockProps) {
  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div
      data-testid="feature-cta-block"
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {cards.map((card) => {
        const isDark = card.variant === 'dark-purple'
        return (
          <div
            key={card.buttonHref}
            className={`rounded-md p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              isDark ? 'bg-feature text-white' : 'bg-alt text-text-primary'
            }`}
          >
            <h3 className={`mb-3 text-lg font-bold ${isDark ? 'text-white' : 'text-text-primary'}`}>
              {card.heading}
            </h3>
            <p className={`mb-4 text-sm ${isDark ? 'text-text-on-dark-muted' : 'text-text-muted'}`}>
              {card.description}
            </p>
            <a
              href={card.buttonHref}
              className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
                isDark
                  ? 'text-white hover:text-text-on-dark-muted'
                  : 'text-link hover:text-link-hover'
              }`}
            >
              {card.buttonLabel}
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
      })}
    </div>
  )
}
