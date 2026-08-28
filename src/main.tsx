import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import './styles/global.css'

// HashRouter, not BrowserRouter: GitHub Pages serves static files and 404s on a
// deep path like /etutor/vocabulary/opportunity. Hash routes need no 404.html
// redirect trick and no URL flash on load.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </StrictMode>,
)
