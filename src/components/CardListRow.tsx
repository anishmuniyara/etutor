import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Card } from '../types'
import { ChevronRight, EyeOff, Star } from './Icons'

interface CardListRowProps {
  card: Card
  index: number
  meta: string
  offset: number
  dragging: boolean
  isFavorite: boolean
  swipeHandlers: {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void
    onPointerUp: () => void
    onPointerCancel: () => void
  }
  onOpen: () => void
  onHide: () => void
  onToggleFavorite: () => void
}

export function CardListRow({
  card,
  index,
  meta,
  offset,
  dragging,
  isFavorite,
  swipeHandlers,
  onOpen,
  onHide,
  onToggleFavorite,
}: CardListRowProps) {
  return (
    <div className="list-row">
      {/* Revealed by the swipe; touch-only, since the row also carries an always-visible hide button. */}
      {offset < 0 ? (
        <button type="button" className="list-row__action" onClick={onHide} aria-label={`Hide ${card.term}`}>
          <EyeOff size={18} />
          <span>HIDE</span>
        </button>
      ) : null}

      <div
        className="list-row__button"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen()
          }
        }}
        {...swipeHandlers}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform .22s ease',
        }}
      >
        <div className="list-row__num">{String(index + 1).padStart(2, '0')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
          <div className="list-row__title">{card.term}</div>
          <div className="list-row__meta">{meta}</div>
        </div>

        <button
          type="button"
          className="row-tool"
          data-active={isFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${card.term} from saved` : `Save ${card.term}`}
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorite()
          }}
        >
          <Star size={17} filled={isFavorite} />
        </button>

        {/* The swipe is touch-only, so keyboard and mouse get a real control. */}
        <button
          type="button"
          className="row-tool"
          aria-label={`Hide ${card.term}`}
          onClick={(event) => {
            event.stopPropagation()
            onHide()
          }}
        >
          <EyeOff size={17} />
        </button>

        <ChevronRight size={18} stroke="var(--sub)" />
      </div>
    </div>
  )
}
