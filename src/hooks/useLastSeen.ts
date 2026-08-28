import { useCallback, useEffect, useState } from 'react'
import { KEYS, type LastSeen, read, write } from '../lib/storage'

const EMPTY: LastSeen = { byCategory: {} }

/**
 * Where the user left off, so a refresh doesn't cost them their place.
 *
 * Deliberately surfaced as a "Continue" affordance on Home rather than an
 * automatic redirect: force-navigating someone who opened the app to browse
 * categories feels broken.
 */
export function useLastSeen() {
  const [state, setState] = useState<LastSeen>(() => {
    const stored = read<LastSeen>(KEYS.lastSeen, EMPTY)
    return stored.byCategory && typeof stored.byCategory === 'object' ? stored : EMPTY
  })

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== KEYS.lastSeen) return
      setState(read<LastSeen>(KEYS.lastSeen, EMPTY))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const record = useCallback((slug: string, cardId: string, revealed: boolean) => {
    setState((current) => {
      const previous = current.byCategory[slug]
      if (current.lastCategory === slug && previous?.cardId === cardId && previous.revealed === revealed) {
        return current
      }
      const next: LastSeen = {
        lastCategory: slug,
        byCategory: { ...current.byCategory, [slug]: { cardId, revealed } },
      }
      write(KEYS.lastSeen, next)
      return next
    })
  }, [])

  const forCategory = useCallback((slug: string) => state.byCategory[slug], [state])

  const resume = state.lastCategory ? state.byCategory[state.lastCategory] : undefined

  return {
    record,
    forCategory,
    lastCategory: state.lastCategory,
    resumeCardId: resume?.cardId,
    resumeRevealed: resume?.revealed ?? false,
  }
}
