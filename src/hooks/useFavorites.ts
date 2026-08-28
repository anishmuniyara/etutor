import { useCallback, useMemo } from 'react'
import { usePersistentMap } from './usePersistentMap'
import { KEYS, idsFor, withId, withoutId } from '../lib/storage'

/** Starred cards, keyed by stable card id, same shape as the hidden set. */
export function useFavorites(slug?: string) {
  const [map, update] = usePersistentMap(KEYS.favorites)

  const favoriteIds = useMemo(() => new Set(slug ? idsFor(map, slug) : []), [map, slug])

  const toggle = useCallback(
    (id: string, category = slug) => {
      if (!category) return
      update((m) => (idsFor(m, category).includes(id) ? withoutId(m, category, id) : withId(m, category, id)))
    },
    [update, slug],
  )

  /** Categories that actually hold stars, so the Saved view fetches only those files. */
  const categoriesWithFavorites = useMemo(
    () => Object.keys(map).filter((key) => idsFor(map, key).length > 0),
    [map],
  )

  const totalFavorites = useMemo(
    () => categoriesWithFavorites.reduce((sum, key) => sum + idsFor(map, key).length, 0),
    [categoriesWithFavorites, map],
  )

  return { map, favoriteIds, toggle, categoriesWithFavorites, totalFavorites }
}
