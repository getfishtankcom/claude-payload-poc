/**
 * Inline tooltip for glossary terms. Pulls a flat list of terms from the
 * dictionary endpoint once per session and matches the children text
 * against it to render <abbr> with a definition.
 */
'use client'

import React, { useEffect, useMemo, useState } from 'react'

interface DictionaryTerm {
  id: string | number
  term: string
  termFr?: string
  definition?: unknown
  definitionFr?: unknown
}

let dictionaryCache: { at: number; terms: DictionaryTerm[] } | null = null
const CACHE_TTL_MS = 5 * 60_000

async function loadDictionary(): Promise<DictionaryTerm[]> {
  const now = Date.now()
  if (dictionaryCache && now - dictionaryCache.at < CACHE_TTL_MS) {
    return dictionaryCache.terms
  }
  try {
    const res = await fetch('/api/dictionary')
    if (!res.ok) return []
    const data = (await res.json()) as { terms?: DictionaryTerm[] }
    const terms = data.terms ?? []
    dictionaryCache = { at: now, terms }
    return terms
  } catch {
    return []
  }
}

function richTextToString(rt: unknown): string {
  // Lexical-style rich text — walk root.children and concatenate text leaves.
  const root = (rt as { root?: { children?: Array<Record<string, unknown>> } })?.root
  if (!root || !Array.isArray(root.children)) return ''
  const parts: string[] = []
  const walk = (node: Record<string, unknown>) => {
    if (typeof node.text === 'string') parts.push(node.text)
    if (Array.isArray(node.children)) {
      for (const c of node.children as Record<string, unknown>[]) walk(c)
    }
  }
  for (const node of root.children) walk(node)
  return parts.join(' ').trim()
}

export interface GlossaryTooltipProps {
  /** Term to look up. Children are rendered as the visible label. */
  term: string
  locale?: 'en' | 'fr'
  children?: React.ReactNode
}

export function GlossaryTooltip({ term, locale = 'en', children }: GlossaryTooltipProps) {
  const [dict, setDict] = useState<DictionaryTerm[]>(dictionaryCache?.terms ?? [])

  useEffect(() => {
    let cancelled = false
    loadDictionary().then((terms) => {
      if (!cancelled) setDict(terms)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const definition = useMemo(() => {
    const lower = term.toLowerCase()
    const match = dict.find(
      (t) =>
        t.term?.toLowerCase() === lower ||
        (locale === 'fr' && t.termFr?.toLowerCase() === lower),
    )
    if (!match) return ''
    const rich = locale === 'fr' && match.definitionFr ? match.definitionFr : match.definition
    return richTextToString(rich)
  }, [dict, term, locale])

  if (!definition) {
    // No definition yet — just render the children as plain text.
    return <>{children ?? term}</>
  }

  return (
    <abbr
      title={definition}
      style={{
        textDecorationStyle: 'dotted',
        textDecorationLine: 'underline',
        cursor: 'help',
      }}
    >
      {children ?? term}
    </abbr>
  )
}
