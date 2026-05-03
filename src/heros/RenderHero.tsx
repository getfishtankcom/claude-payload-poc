/**
 * @description
 * Hero type discriminator that maps the hero `type` field value
 * to the correct hero variant component. Returns null for 'none'.
 *
 * Key features:
 * - Maps 'highImpact' → HighImpactHero, 'lowImpact' → LowImpactHero
 * - Returns null for 'none' or unknown types
 * - Spreads all hero props to the variant component
 *
 * @dependencies
 * - HighImpact hero component
 * - LowImpact hero component
 *
 * @notes
 * - Follows official Payload website template RenderHero pattern
 * - Hero data comes from the hero group field on Pages/Homepage
 */
import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from './HighImpact'
import { LowImpactHero } from './LowImpact'

const heroComponents = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
}

type RenderHeroProps = Page['hero'] & {
  /** Forwarded by callers so server-side hero variants can read
      locale-explicit translations. Optional for backwards-compat. */
  locale?: string
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroComponents[type as keyof typeof heroComponents]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
