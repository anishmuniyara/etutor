import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Card, CategoryMeta } from '../types'
import { loadCards, searchCards } from '../lib/content'
import { levelLabel } from '../lib/levels'
import { useHiddenCards } from '../hooks/useHiddenCards'
import { useFavorites } from '../hooks/useFavorites'
import { useSwipeToHide } from '../hooks/useSwipeToHide'
import { useAsync } from '../hooks/useAsync'
import { CardListRow } from '../components/CardListRow'
import { SearchBox } from '../components/SearchBox'
import { Toast } from '../components/Toast'
import { ChevronLeft } from '../components/Icons'

export function CategoryPage({ categories }: { categories: CategoryMeta[] }) {
  const { category: slug = '' } = useParams()
  const navigate = useNavigate()
  const meta = categories.find((c) => c.slug === slug)

  const load = useCallback(() => loadCards(slug), [slug])
  const { data: cards, error, loading } = useAsync<Card[]>(load, !!meta)

  const { hiddenIds, hiddenCount, hide, unhide, unhideAll } = useHiddenCards(slug)
  const { favoriteIds, toggle: toggleFavorite } = useFavorites(slug)
  const swipe = useSwipeToHide()

  const [query, setQuery] = useState('')
  const [undo, setUndo] = useState<{ id: string; term: string } | null>(null)

  const visible = useMemo(() => {
    const shown = (cards ?? []).filter((card) => !hiddenIds.has(card.id))
    return searchCards(shown, query)
  }, [cards, hiddenIds, query])

  if (!meta) {
    return (
      <div className="page page--narrow">
        <div className="state-block glass">
          <div>That category doesn’t exist.</div>
          <button type="button" className="text-button" onClick={() => navigate('/')}>
            Back to categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page page--narrow" style={{ gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="button" className="icon-button" onClick={() => navigate('/')} aria-label="Back to categories">
          <ChevronLeft size={19} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <h1 className="title">{meta.name}</h1>
          <div className="muted">
            {visible.length} of {cards?.length ?? meta.count} cards
          </div>
        </div>
      </div>

      <SearchBox
        value={query}
        onChange={setQuery}
        placeholder={`Search ${meta.name.toLowerCase()}`}
        resultLabel={`${visible.length} ${visible.length === 1 ? 'match' : 'matches'}`}
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="state-block glass">
          <div>Couldn’t load this category’s content.</div>
          <div style={{ fontSize: 12 }}>{error.message}</div>
        </div>
      ) : null}

      {cards ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map((card, index) => (
            <CardListRow
              key={card.id}
              card={card}
              index={index}
              meta={`${levelLabel(card.level).toUpperCase()}${card.partOfSpeech ? ` · ${card.partOfSpeech.toUpperCase()}` : ''}`}
              offset={swipe.offsetFor(card.id)}
              dragging={swipe.isDragging(card.id)}
              isFavorite={favoriteIds.has(card.id)}
              swipeHandlers={swipe.handlers(card.id)}
              onOpen={() => {
                if (swipe.consumeDrag(card.id)) return
                navigate(`/${slug}/${card.id}`)
              }}
              onHide={() => {
                hide(card.id)
                swipe.close()
                setUndo({ id: card.id, term: card.term })
              }}
              onToggleFavorite={() => toggleFavorite(card.id)}
            />
          ))}

          {visible.length === 0 ? (
            <div className="state-block glass">
              {query ? (
                <div>No cards match “{query}”.</div>
              ) : hiddenCount > 0 ? (
                <>
                  <div>Every card here is hidden.</div>
                  <button type="button" className="text-button" onClick={unhideAll}>
                    Unhide all
                  </button>
                </>
              ) : (
                <div>No cards in this category yet.</div>
              )}
            </div>
          ) : null}

          <div className="center-note">Swipe a card left to hide it</div>

          {hiddenCount > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '4px 6px',
              }}
            >
              <div className="muted">
                {hiddenCount} {hiddenCount === 1 ? 'card' : 'cards'} hidden from this list
              </div>
              <button type="button" className="text-button" onClick={unhideAll}>
                Unhide all
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {undo ? (
        <Toast
          message={`“${undo.term}” hidden`}
          actionLabel="UNDO"
          onAction={() => unhide(undo.id)}
          onDismiss={() => setUndo(null)}
        />
      ) : null}
    </div>
  )
}
