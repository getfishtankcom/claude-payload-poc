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

  it("getComponentsByCategory('content') returns 10 items", () => {
    expect(getComponentsByCategory('content')).toHaveLength(10)
  })

  it("getComponentsByCategory('layout') returns 7 items", () => {
    expect(getComponentsByCategory('layout')).toHaveLength(7)
  })

  it("getComponentsByCategory('data') returns 9 items", () => {
    expect(getComponentsByCategory('data')).toHaveLength(9)
  })

  it("getComponentsByCategory('interactive') returns 5 items", () => {
    expect(getComponentsByCategory('interactive')).toHaveLength(5)
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
