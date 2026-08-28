/**
 * Per-user state for a site with no server and no account.
 *
 * localStorage over cookies: ~5 MB instead of 4 KB, and because GitHub Pages is
 * static the server never reads any of this — paying cookie overhead on every
 * request would buy nothing.
 *
 * Two rules this file exists to enforce:
 *
 * 1. Every access is wrapped in try/catch. Safari private mode and "block site
 *    data" make the accessor itself throw, not just return null, and the app must
 *    still render.
 * 2. Every key is namespaced. On <user>.github.io/etutor/ the origin is
 *    <user>.github.io, so storage is shared with every other project page on that
 *    account; an unprefixed "hidden" would collide with a neighbouring site.
 */

const PREFIX = 'etutor.'

export const KEYS = {
  hidden: `${PREFIX}hidden.v1`,
  favorites: `${PREFIX}favorites.v1`,
  lastSeen: `${PREFIX}lastSeen.v1`,
} as const

/** Cards the user has dismissed, keyed by category slug → stable card ids. */
export type IdsByCategory = Record<string, string[]>

export interface LastSeen {
  lastCategory?: string
  byCategory: Record<string, { cardId: string; revealed: boolean }>
}

function available(): Storage | null {
  try {
    const s = window.localStorage
    // Touching the API is what throws in blocked contexts, so probe it here.
    const probe = `${PREFIX}__probe`
    s.setItem(probe, '1')
    s.removeItem(probe)
    return s
  } catch {
    return null
  }
}

export function read<T>(key: string, fallback: T): T {
  try {
    const store = available()
    if (!store) return fallback
    const raw = store.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw) as unknown
    // Guard against a stale or hand-edited value of the wrong shape.
    if (parsed === null || typeof parsed !== 'object') return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function write(key: string, value: unknown): void {
  try {
    const store = available()
    if (!store) return
    store.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage blocked — the session still works, it just
    // won't survive a refresh. Failing loudly here would help no one.
  }
}

/* ---------- Helpers over the id-set shape ---------- */

export function idsFor(map: IdsByCategory, slug: string): string[] {
  const ids = map[slug]
  return Array.isArray(ids) ? ids : []
}

export function withId(map: IdsByCategory, slug: string, id: string): IdsByCategory {
  const current = idsFor(map, slug)
  if (current.includes(id)) return map
  return { ...map, [slug]: [...current, id] }
}

export function withoutId(map: IdsByCategory, slug: string, id: string): IdsByCategory {
  const current = idsFor(map, slug)
  if (!current.includes(id)) return map
  const next = current.filter((existing) => existing !== id)
  const copy = { ...map }
  if (next.length) copy[slug] = next
  else delete copy[slug]
  return copy
}

export function withoutCategory(map: IdsByCategory, slug: string): IdsByCategory {
  if (!(slug in map)) return map
  const copy = { ...map }
  delete copy[slug]
  return copy
}
