import { describe, it, expect } from 'vitest'
import {
  componentRegistry,
  componentsByType,
  getComponentsByCategory,
  getComponentType,
  searchComponents,
  getComponentsForZone,
} from './registry'

describe('component registry helpers', () => {
  it('componentsByType is keyed by type slug', () => {
    expect(componentsByType['rich-text']).toBeDefined()
    expect(componentsByType['rich-text'].type).toBe('rich-text')
  })

  it('getComponentType returns the matching component', () => {
    const c = getComponentType('hero-banner')
    expect(c).toBeDefined()
    expect(c?.type).toBe('hero-banner')
  })

  it('getComponentType returns undefined for unknown slugs', () => {
    expect(getComponentType('not-a-real-component')).toBeUndefined()
  })

  it("getComponentsByCategory('content') returns 11 items (post-Layer-1: +disclaimer)", () => {
    expect(getComponentsByCategory('content')).toHaveLength(11)
  })

  it("getComponentsByCategory('layout') returns 10 items (post-Layer-1: +quick-links, page-header, promo-card-grid)", () => {
    expect(getComponentsByCategory('layout')).toHaveLength(10)
  })

  it("getComponentsByCategory('data') returns 21 items (post-Layer-1: +12 new data widgets)", () => {
    expect(getComponentsByCategory('data')).toHaveLength(21)
  })

  it("getComponentsByCategory('interactive') returns 11 items (post-Layer-1: +6 new interactive)", () => {
    expect(getComponentsByCategory('interactive')).toHaveLength(11)
  })

  it('total registry size is 53 components (Layer-1 expansion target)', () => {
    expect(componentRegistry).toHaveLength(53)
  })

  it('searchComponents matches by label and description (case-insensitive)', () => {
    const results = searchComponents('hero')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.type === 'hero-banner')).toBe(true)
  })

  it('searchComponents returns empty for no match', () => {
    expect(searchComponents('zzznotacomponent')).toHaveLength(0)
  })

  it('getComponentsForZone with no constraint returns the full registry', () => {
    expect(getComponentsForZone()).toHaveLength(componentRegistry.length)
    expect(getComponentsForZone([])).toHaveLength(componentRegistry.length)
  })

  it('getComponentsForZone filters by allowedComponents list', () => {
    const allowed = ['rich-text', 'hero-banner']
    const filtered = getComponentsForZone(allowed)
    expect(filtered.map((c) => c.type).sort()).toEqual(allowed.slice().sort())
  })

  it('every registered component has a valid category', () => {
    for (const c of componentRegistry) {
      expect(['content', 'layout', 'data', 'interactive']).toContain(c.category)
    }
  })

  it('every registered component has a unique type slug', () => {
    const types = componentRegistry.map((c) => c.type)
    expect(new Set(types).size).toBe(types.length)
  })
})
