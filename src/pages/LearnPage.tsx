import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Card, CategoryMeta } from '../types'
import { loadCards } from '../lib/content'
import { levelLabel } from '../lib/levels'
import { useAsync } from '../hooks/useAsync'
import { useHiddenCards } from '../hooks/useHiddenCards'
import { useFavorites } from '../hooks/useFavorites'
import { useLastSeen } from '../hooks/useLastSeen'
import { CardTemplate } from '../components/cards'
import { ChevronLeft, ChevronRight, HomeIcon, Star } from '../components/Icons'

export function LearnPage({ categories }: { categories: CategoryMeta[] }) {
  const { category: slug = '', cardId = '' } = useParams()
  const navigate = useNavigate()
  const meta = categories.find((c) => c.slug === slug)

  const load = useCallback(() => loadCards(slug), [slug])
  const { data: cards, error, loading } = useAsync<Card[]>(load, !!meta)

  const { hiddenIds } = useHiddenCards(slug)
  const { favoriteIds, toggle: toggleFavorite } = useFavorites(slug)
  const { record, forCategory } = useLastSeen()

  const [revealed, setRevealed] = useState(() => forCategory(slug)?.cardId === cardId && forCategory(slug)?.revealed)

  // Prev/next walks the visible cards only, so hidden cards stay hidden here too.
  const visible = useMemo(() => (cards ?? []).filter((card) => !hiddenIds.has(card.id)), [cards, hiddenIds])

  const position = visible.findIndex((card) => card.id === cardId)
  const card = position >= 0 ? visible[position] : undefined

  // The card may exist but be hidden — reached via a bookmark or the browser's
  // back button after hiding it. Show it rather than 404-ing on the user.
  const fallback = cards?.find((c) => c.id === cardId)
  const shown = card ?? fallback

  useEffect(() => {
    if (shown) record(slug, shown.id, !!revealed)
  }, [shown, slug, revealed, record])

  // Moving to a different card closes the reveal gate again — that gate is the
  // whole point of the recall exercise. The ref skips the first run so a resumed
  // session keeps the revealed state it was restored with.
  const previousCardId = useRef(cardId)
  useEffect(() => {
    if (previousCardId.current === cardId) return
    previousCardId.current = cardId
    setRevealed(false)
  }, [cardId])

  const step = (direction: 1 | -1) => {
    if (!visible.length) return
    const from = position >= 0 ? position : 0
    const next = (from + direction + visible.length) % visible.length
    navigate(`/${slug}/${visible[next].id}`)
  }

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

  if (loading) {
    return (
      <div className="page page--narrow" style={{ gap: 18 }}>
        <div className="skeleton" style={{ height: 140, borderRadius: 24 }} />
        <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
      </div>
    )
  }

  if (error || !shown) {
    return (
      <div className="page page--narrow">
        <div className="state-block glass">
          <div>{error ? 'Couldn’t load this category’s content.' : 'That card is no longer here.'}</div>
          <button type="button" className="text-button" onClick={() => navigate(`/${slug}`)}>
            Back to {meta.name}
          </button>
        </div>
      </div>
    )
  }

  const isFavorite = favoriteIds.has(shown.id)
  const cardMeta = [levelLabel(shown.level).toUpperCase(), shown.partOfSpeech?.toUpperCase(), shown.businessCategory?.toUpperCase()]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      className="page page--narrow"
      style={{ gap: 'clamp(18px,3vw,26px)', paddingBottom: 150 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          type="button"
          className="icon-button"
          onClick={() => navigate(`/${slug}`)}
          aria-label={`Back to ${meta.name}`}
        >
          <ChevronLeft size={19} />
        </button>
        <div className="title" style={{ flex: 1 }}>
          {meta.name}
        </div>
        <button
          type="button"
          className="icon-button"
          data-active={isFavorite}
          style={{ color: isFavorite ? 'var(--acc)' : 'var(--sub)' }}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Remove from saved' : 'Save this card'}
          onClick={() => toggleFavorite(shown.id)}
        >
          <Star size={18} filled={isFavorite} />
        </button>
        <div className="pill">
          {position >= 0 ? `${position + 1} / ${visible.length}` : 'HIDDEN'}
        </div>
      </div>

      <div className="learn-hero glass-solid">
        <div className="learn-hero__word">{shown.term}</div>
        {cardMeta ? <div className="learn-hero__meta">{cardMeta}</div> : null}
      </div>

      {!revealed ? (
        <div className="reveal-gate">
          <div style={{ fontSize: 13.5, color: 'var(--sub)', textAlign: 'center' }}>
            Details are hidden — try to recall them first.
          </div>
          <button type="button" className="primary-button" onClick={() => setRevealed(true)}>
            Show Details
          </button>
        </div>
      ) : (
        <div className="card-body glass">
          <CardTemplate template={meta.template} card={shown} />
          <button
            type="button"
            className="text-button"
            style={{ color: 'var(--sub)', alignSelf: 'center', fontSize: 12 }}
            onClick={() => setRevealed(false)}
          >
            Hide details
          </button>
        </div>
      )}

      <div className="bottom-bar">
        <div className="bottom-bar__inner">
          <button
            type="button"
            className="nav-button"
            onClick={() => step(-1)}
            disabled={visible.length < 2}
            aria-label="Previous card"
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>
          <button type="button" className="fab" onClick={() => navigate('/')} aria-label="Home">
            <HomeIcon size={22} />
          </button>
          <button
            type="button"
            className="nav-button"
            onClick={() => step(1)}
            disabled={visible.length < 2}
            aria-label="Next card"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
