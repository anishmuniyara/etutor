#!/usr/bin/env node
/**
 * Content gate. Runs before every build and in CI.
 *
 * Ids are the anchor for all persisted user state (hidden cards, favourites,
 * resume position), so a duplicate or non-URL-safe id is a hard failure — it
 * would silently corrupt someone's saved state, not just look wrong.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'content')

const LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
const TEMPLATES = new Set(['explanation', 'grammar', 'comparison', 'conversation'])
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Each template's own must-have fields, on top of the shared id/term/level. */
const REQUIRED_BY_TEMPLATE = {
  explanation: ['meaning', 'usage', 'examples'],
  grammar: ['definition', 'usage', 'formula', 'examples'],
  comparison: [],
  conversation: [],
}

const errors = []
const warnings = []

function fail(where, message) {
  errors.push(`${where}: ${message}`)
}

function warn(where, message) {
  warnings.push(`${where}: ${message}`)
}

const manifest = JSON.parse(await readFile(join(contentDir, 'categories.json'), 'utf8'))

if (!Array.isArray(manifest)) {
  fail('categories.json', 'must be an array')
}

const seenSlugs = new Set()
let totalCards = 0

for (const category of manifest) {
  const where = `categories.json[${category.slug ?? '?'}]`

  if (!category.slug) fail(where, 'missing slug')
  if (seenSlugs.has(category.slug)) fail(where, `duplicate slug "${category.slug}"`)
  seenSlugs.add(category.slug)
  if (!category.name) fail(where, 'missing name')
  if (!TEMPLATES.has(category.template)) {
    fail(where, `template "${category.template}" is not one of ${[...TEMPLATES].join(', ')}`)
  }
  if (!category.icon) warn(where, 'no icon path — the tile will render an empty square')

  let cards
  try {
    cards = JSON.parse(await readFile(join(contentDir, `${category.slug}.json`), 'utf8'))
  } catch (error) {
    fail(where, `cannot read ${category.slug}.json — ${error.message}`)
    continue
  }

  if (!Array.isArray(cards)) {
    fail(`${category.slug}.json`, 'must be an array (context.md §7)')
    continue
  }

  if (category.count !== cards.length) {
    fail(
      where,
      `count is ${category.count} but ${category.slug}.json holds ${cards.length} — run "npm run manifest"`,
    )
  }

  totalCards += cards.length
  const seenIds = new Set()

  cards.forEach((card, index) => {
    const at = `${category.slug}.json[${index}] (${card.id ?? card.term ?? 'unnamed'})`

    if (!card.id) fail(at, 'missing id')
    else if (!ID_PATTERN.test(card.id)) fail(at, `id "${card.id}" is not lowercase-kebab and URL-safe`)
    else if (seenIds.has(card.id)) fail(at, `duplicate id "${card.id}" within this category`)
    if (card.id) seenIds.add(card.id)

    if (!card.term) fail(at, 'missing term')
    if (!LEVELS.has(card.level)) fail(at, `level "${card.level}" is not one of ${[...LEVELS].join(', ')}`)

    for (const field of REQUIRED_BY_TEMPLATE[category.template] ?? []) {
      const value = card[field]
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === '') {
        fail(at, `missing required "${field}" for the ${category.template} template`)
      }
    }

    if (card.examples !== undefined) {
      if (!Array.isArray(card.examples)) {
        fail(at, 'examples must be an array')
      } else {
        card.examples.forEach((example, i) => {
          if (typeof example !== 'object' || example === null) {
            fail(at, `examples[${i}] must be an object, not a bare string (context.md §10)`)
          } else if (!example.sentence) {
            fail(at, `examples[${i}] missing "sentence"`)
          }
        })
        // §10: examples exist to show a usage radius, not to reword one sentence.
        const contexts = card.examples.map((e) => e?.context).filter(Boolean)
        if (contexts.length > 1 && new Set(contexts).size === 1) {
          warn(at, `all ${contexts.length} examples share the context "${contexts[0]}"`)
        }
      }
    }

    if (card.remember !== undefined && !Array.isArray(card.remember)) {
      fail(at, 'remember must be an array of strings')
    }

    if (category.template === 'comparison') {
      const hasItems = Array.isArray(card.items) && card.items.length >= 2
      const hasAlternatives = Array.isArray(card.alternatives) && card.alternatives.length >= 2
      if (!hasItems && !hasAlternatives) {
        fail(at, 'comparison cards need either items[] (2+) or alternatives[] (2+)')
      }
      if (hasItems && !card.difference) fail(at, 'comparison cards with items[] need a "difference"')
    }

    if (category.template === 'conversation') {
      const hasConversation = Array.isArray(card.conversation) && card.conversation.length > 0
      const hasExamples = Array.isArray(card.examples) && card.examples.length > 0
      if (!hasConversation && !hasExamples) {
        fail(at, 'conversation cards need a conversation[] or examples[]')
      }
      if (hasConversation) {
        card.conversation.forEach((turn, i) => {
          if (!turn?.speaker || !turn?.text) fail(at, `conversation[${i}] needs both "speaker" and "text"`)
        })
      }
      if (!card.goal && !card.situation && !card.purpose) {
        warn(at, 'no goal / situation / purpose — the card opens with no framing')
      }
    }

    // §11: usage must say when to use the term, not restate the meaning.
    if (card.usage && card.meaning && card.usage.trim() === card.meaning.trim()) {
      fail(at, 'usage repeats meaning verbatim (context.md §11)')
    }
  })
}

for (const message of warnings) console.warn(`warn  ${message}`)

if (errors.length) {
  console.error(`\n${errors.length} content error(s):\n`)
  for (const message of errors) console.error(`  ✗ ${message}`)
  process.exit(1)
}

console.log(
  `✓ ${manifest.length} categories, ${totalCards} cards valid` +
    (warnings.length ? ` (${warnings.length} warning(s))` : ''),
)
