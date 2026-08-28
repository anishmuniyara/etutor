import { useCallback } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { loadCategories } from './lib/content'
import type { CategoryMeta } from './types'
import { useAsync } from './hooks/useAsync'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { LearnPage } from './pages/LearnPage'
import { SavedPage } from './pages/SavedPage'

export function App() {
  const load = useCallback(() => loadCategories(), [])
  const { data: categories, error, loading } = useAsync<CategoryMeta[]>(load)

  if (loading) {
    return (
      <div className="page page--wide">
        <div className="category-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !categories) {
    return (
      <div className="page page--narrow">
        <div className="state-block glass">
          <div>Couldn’t load the category list.</div>
          <div style={{ fontSize: 12 }}>{error?.message}</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage categories={categories} />} />
      <Route path="/saved" element={<SavedPage categories={categories} />} />
      <Route path="/:category" element={<CategoryPage categories={categories} />} />
      <Route path="/:category/:cardId" element={<LearnPage categories={categories} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
