# eTutor

A mobile-first English learning app built around compact cards that explain **what an
expression means, when to use it, and how people actually say it**.

All learning material lives in per-category JSON files served as static assets, so
adding or editing content never requires touching React code — see
[`context.md`](./context.md) for the full content spec and [`design/`](./design) for
the original mockups (v3 is the definitive one).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173/etutor/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Validates content, typechecks, then builds to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run validate:content` | Schema + id-uniqueness gate over all category files |
| `npm run manifest` | Recomputes each category's `count` in `categories.json` |
| `npm run typecheck` | TypeScript only |

## Adding or editing content

Content is the point of this app, and it is designed so that content work needs no
code changes.

**To edit a card:** open `public/content/<category>.json` and change it. That's the
whole process — the app fetches these files at runtime.

**To add cards:** append to the array, then run `npm run manifest` so the Home tile
count stays honest, and `npm run validate:content` to check the shape.

**To add a whole category:**

1. Create `public/content/<slug>.json` containing an array of cards.
2. Add an entry to `public/content/categories.json` with the `slug`, display `name`,
   a `template` (`explanation` | `grammar` | `comparison` | `conversation`), and one
   or two SVG path strings for the tile icon.
3. Run `npm run manifest`.

No new component is needed unless the content genuinely needs a layout none of the
four templates provides.

### Card ids are load-bearing

Every id must be unique within its file, lowercase-kebab, and **stable forever**.
All saved user state — hidden cards, favourites, resume position — is keyed by id.
Renaming an id silently discards whatever a user had saved against it; changing the
displayed `term` is free. `validate:content` enforces uniqueness and format.

## Architecture

```
public/content/          the entire learning library + the category manifest
src/lib/content.ts       fetches and caches content; free-text search
src/lib/storage.ts       the localStorage layer (see below)
src/hooks/               useHiddenCards · useFavorites · useLastSeen · useSwipeToHide
src/components/sections/ nine reusable card sections
src/components/cards/    the four templates, composed from those sections
src/pages/               Home · Category · Learn · Saved
scripts/                 content validation + manifest count regeneration
```

Thirteen categories, four templates. The mapping lives in `categories.json`, not in
code, which is what keeps step 3 above from requiring a pull request.

## Saved state

There is no server and no account, so anything personal lives in the browser.
`localStorage` rather than cookies: ~5 MB instead of 4 KB, and since the site is
static the server never needs to read any of it.

| Key | Holds |
| --- | --- |
| `etutor.hidden.v1` | `{ "vocabulary": ["opportunity"], … }` — cards removed from a list |
| `etutor.favorites.v1` | same shape — starred cards, shown in **Saved** |
| `etutor.lastSeen.v1` | last category and card, plus whether details were revealed |

Two details worth knowing before you change this:

- **Keys are namespaced deliberately.** On `<user>.github.io/etutor/` the origin is
  `<user>.github.io`, so storage is shared with every other project page on that
  account. An unprefixed `hidden` would collide with a neighbouring site.
- **Every access is wrapped in `try`/`catch`.** In Safari private mode and with
  "block site data" enabled, touching `localStorage` throws rather than returning
  null. The app renders normally in that case; it simply stops remembering.

Hiding a card removes it from the list *and* from the Learn screen's prev/next
walk. Every hide offers an undo, and each category list has an "Unhide all".

## Deploying to GitHub Pages

This project is self-contained. To publish it:

1. Copy this directory into a new **public** repository on github.com.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`.

`.github/workflows/deploy.yml` derives the base path from the repository name, so it
works whether the repo is called `etutor` or something else, and handles a
`<user>.github.io` root site too. To build against a different base locally:

```bash
VITE_BASE=/my-repo-name/ npm run build
```

The workflow runs `npm run build`, which runs content validation first — malformed
content fails the deploy instead of shipping a broken category.

Routing uses `HashRouter` (`/etutor/#/vocabulary/opportunity`) because GitHub Pages
404s on deep paths into a single-page app. That avoids the usual `404.html` redirect
trick and the URL flash it causes.
