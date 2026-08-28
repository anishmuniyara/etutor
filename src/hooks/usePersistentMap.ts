import { useCallback, useEffect, useState } from 'react'
import { type IdsByCategory, read, write } from '../lib/storage'

/**
 * A category → card-id set backed by localStorage.
 *
 * Also listens for `storage` events so two open tabs stay in agreement — hide a
 * card in one tab and the other tab's list drops it too, rather than resurrecting
 * it on its next write.
 */
export function usePersistentMap(key: string) {
  const [map, setMap] = useState<IdsByCategory>(() => read<IdsByCategory>(key, {}))

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return
      setMap(read<IdsByCategory>(key, {}))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const update = useCallback(
    (transform: (current: IdsByCategory) => IdsByCategory) => {
      setMap((current) => {
        const next = transform(current)
        if (next !== current) write(key, next)
        return next
      })
    },
    [key],
  )

  return [map, update] as const
}
