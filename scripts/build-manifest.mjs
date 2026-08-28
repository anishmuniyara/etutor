#!/usr/bin/env node
/**
 * Rewrites the `count` on every entry in categories.json from the actual length
 * of each category file, so the Home tiles can never drift from the content.
 *
 * Run after adding or removing cards: `npm run manifest`
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'content')
const manifestPath = join(contentDir, 'categories.json')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

let changed = 0
for (const category of manifest) {
  const cards = JSON.parse(await readFile(join(contentDir, `${category.slug}.json`), 'utf8'))
  if (category.count !== cards.length) {
    console.log(`  ${category.slug}: ${category.count} → ${cards.length}`)
    category.count = cards.length
    changed += 1
  }
}

if (changed) {
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Updated ${changed} count(s) in categories.json`)
} else {
  console.log('All counts already match.')
}
