import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Card, CategoryMeta } from '../types'
import { loadCards } from '../lib/content'
import { levelLabel } from '../lib/levels'
import { useFavorites } from '../hooks/useFavorites'
import { idsFor } from '../lib/storage'
import { ChevronLeft, ChevronRight, Star } from '../components/Icons'

interface SavedEntry {
  category: CategoryMeta
  cards: Card[]
}

export function SavedPage({ categories }: { categories: CategoryMeta[] }) {
  const navigate = useNavigate()
  const { map, categoriesWithFavorites, toggle } = useFavorites()
  const [entries, setEntries] = useState<SavedEntry[] | null>(null)

  // Only the categories that actually hold stars get fetched — no reason to pull
  // all thirteen files to render a handful of cards.
  useEffect(() => {
    let cancelled = false
    const wanted = categoriesWithFavorites
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter((c): c is CategoryMeta => !!c)

    Promise.all(
      wanted.map(async (category) => {
        const all = await loadCards(category.slug).catch(() => [] as Card[])
        const ids = new Set(idsFor(map, category.slug))
        return { category, cards: all.filter((card) => ids.has(card.id)) }
      }),
    ).then((results) => {
      if (!cancelled) setEntries(results.filter((entry) => entry.cards.length > 0))
    })

    return () => {
      cancelled = true
    }
  }, [categoriesWithFavorites, categories, map])

  return (
    <div className="page page--narrow" style={{ gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="button" className="icon-button" onClick={() => navigate('/')} aria-label="Back to categories">
          <ChevronLeft size={19} />
        </button>
        <h1 className="title">Saved cards</h1>
      </div>

      {entries === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 3 }, (_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="state-block glass">
          <div>Nothing saved yet.</div>
          <div style={{ fontSize: 13 }}>Tap the star on any card to keep it here.</div>
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.category.slug} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="eyebrow">{entry.category.name.toUpperCase()}</div>
            {entry.cards.map((card) => (
              <div className="list-row" key={card.id}>
                <div
                  className="list-row__button"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/${entry.category.slug}/${card.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/${entry.category.slug}/${card.id}`)
                    }
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
                    <div className="list-row__title">{card.term}</div>
                    <div className="list-row__meta">{levelLabel(card.level).toUpperCase()}</div>
                  </div>
                  <button
                    type="button"
                    className="row-tool"
                    data-active="true"
                    aria-label={`Remove ${card.term} from saved`}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggle(card.id, entry.category.slug)
                    }}
                  >
                    <Star size={17} filled />
                  </button>
                  <ChevronRight size={18} stroke="var(--sub)" />
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
