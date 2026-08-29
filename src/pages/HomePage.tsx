import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { CategoryMeta } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import { useLastSeen } from '../hooks/useLastSeen'
import { idsFor } from '../lib/storage'
import { ChevronRight, Star } from '../components/Icons'

export function HomePage({ categories }: { categories: CategoryMeta[] }) {
  const navigate = useNavigate()
  const { lastCategory, resumeCardId } = useLastSeen()
  const { map: favoritesByCategory } = useFavorites()

  // Counted against the live manifest, not the raw store. Favourites saved under
  // a category that has since been retired still sit in localStorage, and Saved
  // filters those out — so counting them here would advertise cards that page
  // cannot show.
  const totalFavorites = useMemo(
    () => categories.reduce((sum, c) => sum + idsFor(favoritesByCategory, c.slug).length, 0),
    [categories, favoritesByCategory],
  )

  const resumeCategory = categories.find((c) => c.slug === lastCategory)

  return (
    <div className="page page--wide">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 'clamp(18px,3vw,32px)' }}>
        <div className="eyebrow">ENGLISH TRAINER</div>
        <h1 className="title">Pick a category</h1>
      </div>

      {/* Offered, not forced — auto-redirecting someone who came to browse feels broken. */}
      {resumeCategory && resumeCardId ? (
        <button
          type="button"
          className="continue-card glass"
          style={{ marginBottom: 16 }}
          onClick={() => navigate(`/${resumeCategory.slug}/${resumeCardId}`)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            <div className="eyebrow">CONTINUE WHERE YOU LEFT OFF</div>
            <div className="category-tile__name">{resumeCategory.name}</div>
          </div>
          <ChevronRight size={18} stroke="var(--sub)" />
        </button>
      ) : null}

      {totalFavorites > 0 ? (
        <Link to="/saved" className="continue-card glass" style={{ marginBottom: 16, color: 'var(--ink)' }}>
          <div className="category-tile__icon">
            <Star size={18} filled />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            <div className="category-tile__name">Saved cards</div>
            <div className="category-tile__count">
              {totalFavorites} {totalFavorites === 1 ? 'card' : 'cards'}
            </div>
          </div>
          <ChevronRight size={18} stroke="var(--sub)" />
        </Link>
      ) : null}

      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            className="category-tile"
            onClick={() => navigate(`/${category.slug}`)}
          >
            <div className="category-tile__icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--acc)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={category.icon} />
                {category.icon2 ? <path d={category.icon2} /> : null}
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div className="category-tile__name">{category.name}</div>
              <div className="category-tile__count">
                {category.count} {category.count === 1 ? 'Card' : 'Cards'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
