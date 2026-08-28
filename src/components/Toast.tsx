import { useEffect, useRef } from 'react'

interface ToastProps {
  /** Changing this restarts the timer, so a second hide re-arms the countdown. */
  message: string
  actionLabel?: string
  onAction?: () => void
  onDismiss: () => void
  /** Long enough to read and reach for Undo without the toast lingering. */
  duration?: number
}

export function Toast({ message, actionLabel, onAction, onDismiss, duration = 5000 }: ToastProps) {
  // Held in a ref so an inline callback from the parent doesn't restart the
  // timer on every render — the toast would then never dismiss itself.
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    const timer = window.setTimeout(() => dismissRef.current(), duration)
    return () => window.clearTimeout(timer)
  }, [message, duration])

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={() => {
            onAction()
            onDismiss()
          }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
