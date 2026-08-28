import { useCallback, useMemo } from 'react'
import { usePersistentMap } from './usePersistentMap'
import { KEYS, idsFor, withId, withoutCategory, withoutId } from '../lib/storage'

/**
 * Cards the user has hidden, keyed by stable card `id`.
 *
 * Design v3 keyed this by array index ("cat:3"). That silently re-points at the
 * wrong card the moment content is inserted or reordered — the normal case for a
 * JSON-driven app whose library grows. Ids are stable by spec (context.md §8), and
 * ids that no longer resolve to a card are simply ignored on read, so deleting
 * content is safe too.
 */
export function useHiddenCards(slug: string) {
  const [map, update] = usePersistentMap(KEYS.hidden)

  const hiddenIds = useMemo(() => new Set(idsFor(map, slug)), [map, slug])

  const hide = useCallback((id: string) => update((m) => withId(m, slug, id)), [update, slug])
  const unhide = useCallback((id: string) => update((m) => withoutId(m, slug, id)), [update, slug])
  const unhideAll = useCallback(() => update((m) => withoutCategory(m, slug)), [update, slug])

  return { hiddenIds, hiddenCount: hiddenIds.size, hide, unhide, unhideAll }
}
