import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project pages live at https://<user>.github.io/<repo>/, so the app is served from
// a subpath. Override with VITE_BASE if the repo is not named "etutor".
export default defineConfig({
  base: process.env.VITE_BASE ?? '/etutor/',
  plugins: [react()],
})
