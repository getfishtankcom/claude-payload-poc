/**
 * @description
 * Board logo hero banner for standards overview pages (Template 5).
 * Displays board crest/wordmark centered with board name below on
 * a brand-color background. Purely decorative, non-interactive.
 *
 * Key features:
 * - Centered board logo and name
 * - Configurable background color (defaults to brand purple)
 * - next/image for optimized logo rendering
 *
 * @dependencies
 * - next/image for logo
 *
 * @notes
 * - Background color comes from CMS or board data
 * - Non-interactive — no hover effects or click handlers
 */
import Image from 'next/image'

export type BoardLogoHeroProps = {
  /** Path to the board logo/crest image */
  logo: string
  /** Full board name displayed below logo */
  boardName: string
  /** Background color — defaults to brand purple */
  backgroundColor?: string
}

export function BoardLogoHero({
  logo,
  boardName,
  backgroundColor = '#601F5B',
}: BoardLogoHeroProps) {
  return (
    <div
      data-testid="board-logo-hero"
      className="flex flex-col items-center justify-center px-6 py-10 text-center"
      style={{ backgroundColor }}
    >
      <Image
        src={logo}
        alt={`${boardName} logo`}
        width={120}
        height={120}
        className="mb-4 h-auto w-auto max-h-[120px]"
      />
      <p className="text-lg font-semibold text-white">{boardName}</p>
    </div>
  )
}
