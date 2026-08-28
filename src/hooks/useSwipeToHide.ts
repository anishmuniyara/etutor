import { useCallback, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/** Thresholds ported from design/English Cards v3.dc.html. */
const MAX_DRAG = 120
const LATCH_AT = 96
const COMMIT_THRESHOLD = 48
/** Below this, the gesture is a tap, not a drag — keeps rows clickable. */
const TAP_SLOP = 6

interface SwipeState {
  key: string
  dx: number
  dragging: boolean
}

/**
 * Swipe-left-to-reveal-hide, one open row at a time.
 *
 * Only one row can be latched open, which is why state lives in the list rather
 * than in each row: opening a second row closes the first.
 */
export function useSwipeToHide() {
  const [swipe, setSwipe] = useState<SwipeState | null>(null)
  const drag = useRef<{ key: string; startX: number; base: number } | null>(null)
  const moved = useRef(false)

  const offsetFor = useCallback((key: string) => (swipe?.key === key ? swipe.dx : 0), [swipe])
  const isDragging = useCallback((key: string) => swipe?.key === key && swipe.dragging, [swipe])

  const close = useCallback(() => setSwipe(null), [])

  const handlers = useCallback(
    (key: string) => ({
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        // Mouse users get the explicit button instead; dragging with a mouse
        // fights with text selection.
        if (event.pointerType === 'mouse') return
        drag.current = { key, startX: event.clientX, base: swipe?.key === key ? swipe.dx : 0 }
        moved.current = false
        try {
          event.currentTarget.setPointerCapture(event.pointerId)
        } catch {
          // Pointer capture is best-effort; the gesture still works without it.
        }
      },
      onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
        const active = drag.current
        if (!active || active.key !== key) return
        const raw = event.clientX - active.startX
        if (Math.abs(raw) > TAP_SLOP) moved.current = true
        const dx = Math.min(0, Math.max(-MAX_DRAG, active.base + raw))
        setSwipe({ key, dx, dragging: true })
      },
      onPointerUp: () => {
        const active = drag.current
        if (!active || active.key !== key) return
        drag.current = null
        setSwipe((current) => {
          const dx = current?.key === key ? current.dx : 0
          return dx < -COMMIT_THRESHOLD ? { key, dx: -LATCH_AT, dragging: false } : null
        })
      },
      onPointerCancel: () => {
        drag.current = null
        setSwipe(null)
      },
    }),
    [swipe],
  )

  /**
   * True when the pointer sequence was a drag, so the row's click should be
   * swallowed. Consumes the flag — a drag suppresses exactly one click.
   */
  const consumeDrag = useCallback((key: string) => {
    if (moved.current) {
      moved.current = false
      return true
    }
    if (swipe?.key === key && swipe.dx < 0) {
      setSwipe(null)
      return true
    }
    return false
  }, [swipe])

  return { offsetFor, isDragging, handlers, consumeDrag, close }
}
