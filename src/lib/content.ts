import type { Card, CategoryMeta } from '../types'

/**
 * Content lives as static JSON next to the built site and is fetched at runtime,
 * so adding or editing cards never requires a rebuild — just a push.
 *
 * Every URL is built off BASE_URL. A hardcoded "/content/…" would resolve against
 * the domain root and 404 under the /etutor/ project-pages subpath.
 */
function contentUrl(file: string): string {
  return `${import.meta.env.BASE_URL}content/${file}`
}

const categoryCache = new Map<string, Card[]>()
let manifestCache: CategoryMeta[] | null = null

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  return (await res.json()) as T
}

export async function loadCategories(): Promise<CategoryMeta[]> {
  if (manifestCache) return manifestCache
  const list = await fetchJson<CategoryMeta[]>(contentUrl('categories.json'))
  manifestCache = list
  return list
}

export async function loadCards(slug: string): Promise<Card[]> {
  const cached = categoryCache.get(slug)
  if (cached) return cached
  const cards = await fetchJson<Card[]>(contentUrl(`${slug}.json`))
  categoryCache.set(slug, cards)
  return cards
}

/** Cards already in memory, without triggering a fetch. Used by the Saved view. */
export function peekCards(slug: string): Card[] | undefined {
  return categoryCache.get(slug)
}

/** The headline text a card leads with, whichever field the category uses. */
export function cardSummary(card: Card): string {
  return card.meaning ?? card.definition ?? card.purpose ?? card.goal ?? card.situation ?? ''
}

/** Normalise for search: lowercase and strip diacritics so "cafe" matches "café". */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Free-text filter over term, summary, and example sentences. */
export function searchCards(cards: Card[], query: string): Card[] {
  const q = normalise(query.trim())
  if (!q) return cards
  return cards.filter((card) => {
    const haystack = [
      card.term,
      cardSummary(card),
      card.usage ?? '',
      ...(card.examples ?? []).map((e) => e.sentence),
      ...(card.keyExpressions ?? []),
      ...(card.items ?? []).map((i) => `${i.term} ${i.meaning}`),
      ...(card.alternatives ?? []).map((a) => `${a.term} ${a.usage}`),
    ].join(' ')
    return normalise(haystack).includes(q)
  })
}
