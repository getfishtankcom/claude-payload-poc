import { describe, it, expect } from 'vitest'
import { BRAND } from './brand'

describe('BRAND constants', () => {
  it('exposes the official long name', () => {
    expect(BRAND.fullName).toBe('Reporting and Assurance Standards (RAS) Canada')
  })

  it('uses RAS as the abbreviation', () => {
    expect(BRAND.abbreviation).toBe('RAS')
  })

  it('every required field is a non-empty string', () => {
    const required: Array<keyof typeof BRAND> = [
      'name',
      'fullName',
      'abbreviation',
      'nameFr',
      'formerName',
      'tagline',
      'domain',
      'url',
      'adminTitle',
    ]
    for (const key of required) {
      const value = BRAND[key]
      expect(typeof value).toBe('string')
      expect(value.length).toBeGreaterThan(0)
    }
  })

  it('domain is a plausible hostname (no protocol, no path)', () => {
    expect(BRAND.domain).toMatch(/^[a-z0-9.-]+\.[a-z]{2,}$/)
  })

  it('url is an absolute https URL', () => {
    expect(BRAND.url).toMatch(/^https:\/\//)
  })
})
