import type { Level } from '../types'

/** JSON stores the standardised CEFR value; the UI decides how to present it. (context.md §9) */
const LABELS: Record<Level, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
}

export const LEVELS = Object.keys(LABELS) as Level[]

export function levelLabel(level: Level | undefined): string {
  return level ? (LABELS[level] ?? level) : ''
}
