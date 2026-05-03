import { describe, expect, it } from 'vitest'

import en from '../../messages/en.json'
import fr from '../../messages/fr.json'

type Dict = Record<string, unknown>

/**
 * Walk the dictionary tree and emit a sorted list of dotted key paths.
 * Used to compare en.json and fr.json structure node-by-node.
 */
function flatKeys(obj: Dict, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flatKeys(value as Dict, path))
    } else {
      keys.push(path)
    }
  }
  return keys.sort()
}

describe('next-intl messages parity (en ⇄ fr)', () => {
  it('every EN key has a matching FR key', () => {
    const enKeys = flatKeys(en as Dict)
    const frKeys = new Set(flatKeys(fr as Dict))

    const missingInFr = enKeys.filter((k) => !frKeys.has(k))

    expect(missingInFr).toEqual([])
  })

  it('every FR key has a matching EN key (no orphan FR translations)', () => {
    const frKeys = flatKeys(fr as Dict)
    const enKeys = new Set(flatKeys(en as Dict))

    const missingInEn = frKeys.filter((k) => !enKeys.has(k))

    expect(missingInEn).toEqual([])
  })

  it('common.siteDescription does not surface the legacy "Financial Reporting & Assurance Standards" string', () => {
    const enValue = (en as { common: { siteDescription: string } }).common.siteDescription
    const frValue = (fr as { common: { siteDescription: string } }).common.siteDescription

    // The org rebranded from "Financial Reporting & Assurance Standards" to
    // "Reporting and Assurance Standards Canada" months ago. Pin the EN copy
    // here so the legacy name can't sneak back via a careless dictionary edit.
    expect(enValue).not.toMatch(/Financial Reporting & Assurance Standards/i)
    expect(enValue).toBeTruthy()
    expect(frValue).toBeTruthy()
  })

  it('every value is a non-empty string at every leaf', () => {
    const enKeys = flatKeys(en as Dict)
    const frKeys = flatKeys(fr as Dict)

    const allLeafsNonEmpty = (dict: Dict, keys: string[]) =>
      keys.every((path) => {
        const value = path.split('.').reduce<unknown>((acc, segment) => {
          if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[segment]
          }
          return undefined
        }, dict)
        return typeof value === 'string' && value.length > 0
      })

    expect(allLeafsNonEmpty(en as Dict, enKeys)).toBe(true)
    expect(allLeafsNonEmpty(fr as Dict, frKeys)).toBe(true)
  })
})
