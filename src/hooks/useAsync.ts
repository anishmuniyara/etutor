import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

/**
 * Runs an async loader and tracks its state.
 *
 * The `cancelled` flag matters here: navigating between categories quickly can
 * land a slow earlier fetch after a faster later one, which would show the wrong
 * category's cards.
 */
export function useAsync<T>(loader: () => Promise<T>, enabled = true): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: enabled })

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, error: null, loading: false })
      return
    }
    let cancelled = false
    setState({ data: null, error: null, loading: true })
    loader().then(
      (data) => {
        if (!cancelled) setState({ data, error: null, loading: false })
      },
      (error: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
            loading: false,
          })
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [loader, enabled])

  return state
}
