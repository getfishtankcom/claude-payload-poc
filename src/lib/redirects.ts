/**
 * Module-scope cache for redirect rules.
 *
 * Middleware can't pull from Payload's local API directly; instead we
 * fetch the public `/api/redirects` REST endpoint with a 5-minute TTL.
 *
 * `findRedirect(pathname)` returns a matching active redirect or null.
 */
export interface RedirectRule {
  from: string
  to: string
  type: '301' | '302'
  active: boolean
}

const TTL_MS = 5 * 60_000
let cache: { at: number; rules: Map<string, RedirectRule> } | null = null
let inflight: Promise<Map<string, RedirectRule>> | null = null

async function loadRedirects(serverUrl: string): Promise<Map<string, RedirectRule>> {
  const url = `${serverUrl.replace(/\/$/, '')}/api/redirects?where[active][equals]=true&limit=1000&depth=0`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return new Map()
  const data = (await res.json()) as { docs?: RedirectRule[] }
  const map = new Map<string, RedirectRule>()
  for (const doc of data.docs ?? []) {
    if (doc.from && doc.to && doc.active !== false) {
      map.set(doc.from, doc)
    }
  }
  return map
}

export async function findRedirect(
  pathname: string,
  serverUrl: string,
): Promise<RedirectRule | null> {
  const now = Date.now()
  if (!cache || now - cache.at > TTL_MS) {
    if (!inflight) {
      inflight = loadRedirects(serverUrl).finally(() => {
        inflight = null
      })
    }
    const rules = await inflight
    cache = { at: now, rules }
  }
  return cache.rules.get(pathname) ?? null
}

/** Force the cache to be re-loaded on the next call. */
export function invalidateRedirectCache() {
  cache = null
}
