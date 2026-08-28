import type { Card, TemplateId } from '../../types'
import {
  AlternativesSection,
  BulletSection,
  ComparisonSection,
  ConversationSection,
  ExamplesSection,
  FormulaSection,
  RememberSection,
  TextSection,
} from '../sections'

/**
 * Four templates, thirteen categories (context.md §16). Each template is only an
 * ordering of the shared sections — the markup lives in one place, so a new
 * category needs JSON and a manifest entry, never a new component (§18).
 */

export interface CardProps {
  card: Card
}

/** Vocabulary, Phrases, Idioms, Daily Expressions, Business English, Polite English, Slang. */
export function ExplanationCard({ card }: CardProps) {
  return (
    <>
      <TextSection label="MEANING" text={card.meaning} />
      <TextSection label="USAGE" text={card.usage} muted />
      <TextSection label="AVOID IN" text={card.avoidIn} muted />
      <ExamplesSection examples={card.examples} />
      <RememberSection remember={card.remember} />
    </>
  )
}

/** Tenses (and any future grammar topic). Uses `definition` rather than `meaning`. */
export function GrammarCard({ card }: CardProps) {
  return (
    <>
      <TextSection label="DEFINITION" text={card.definition ?? card.meaning} />
      <TextSection label="WHEN DO WE USE IT?" text={card.usage} muted />
      <FormulaSection formula={card.formula} />
      <ExamplesSection examples={card.examples} />
      <RememberSection remember={card.remember} />
    </>
  )
}

/**
 * Confusing Words and Synonyms & Alternatives.
 *
 * `items` is an array rather than the fixed A/B pair the mockup used, so a
 * three-way comparison like "look vs see vs watch" works without a new template.
 */
export function ComparisonCard({ card }: CardProps) {
  return (
    <>
      <TextSection label="MEANING" text={card.meaning} />
      <ComparisonSection items={card.items} difference={card.difference} />
      <AlternativesSection alternatives={card.alternatives} />
      <ExamplesSection examples={card.examples} />
      <RememberSection remember={card.remember} />
    </>
  )
}

/** Situational English, Conversation Starters, Short Conversations. */
export function ConversationCard({ card }: CardProps) {
  return (
    <>
      <TextSection label="SITUATION" text={card.goal ?? card.situation ?? card.purpose} muted />
      <ConversationSection conversation={card.conversation} />
      <BulletSection label="KEY EXPRESSIONS" items={card.keyExpressions} />
      <ExamplesSection examples={card.examples} />
      <RememberSection remember={card.remember} />
    </>
  )
}

const TEMPLATES: Record<TemplateId, (props: CardProps) => JSX.Element> = {
  explanation: ExplanationCard,
  grammar: GrammarCard,
  comparison: ComparisonCard,
  conversation: ConversationCard,
}

export function CardTemplate({ template, card }: { template: TemplateId; card: Card }) {
  const Component = TEMPLATES[template] ?? ExplanationCard
  return <Component card={card} />
}
