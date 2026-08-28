import type { ReactNode } from 'react'
import type { Alternative, ComparisonItem, Example, Turn } from '../../types'

/**
 * Reusable card sections (context.md §17). Each returns null when its data is
 * missing, so a card template can list every section it might show and let the
 * data decide what actually renders.
 */

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="section">
      <div className="section-label">{label}</div>
      {children}
    </div>
  )
}

export function TextSection({
  label,
  text,
  muted = false,
}: {
  label: string
  text?: string
  muted?: boolean
}) {
  if (!text) return null
  return (
    <Section label={label}>
      <div className={muted ? 'section__text section__text--sub' : 'section__text'}>{text}</div>
    </Section>
  )
}

export function FormulaSection({ formula }: { formula?: string }) {
  if (!formula) return null
  return (
    <div className="section" style={{ gap: 7 }}>
      <div className="section-label">FORMULA</div>
      <div className="formula">{formula}</div>
    </div>
  )
}

export function ComparisonSection({
  items,
  difference,
}: {
  items?: ComparisonItem[]
  difference?: string
}) {
  if (!items?.length) return null
  return (
    <div className="section" style={{ gap: 10 }}>
      <div className="section-label">COMPARISON</div>
      <div className="compare-grid">
        {items.map((item) => (
          <div className="compare-cell" key={item.term}>
            <div className="compare-cell__term">{item.term}</div>
            <div className="compare-cell__text">{item.meaning}</div>
          </div>
        ))}
      </div>
      {difference ? (
        <div className="section__text" style={{ fontSize: 14 }}>
          <span style={{ fontWeight: 700, color: 'var(--acc)' }}>Difference: </span>
          {difference}
        </div>
      ) : null}
    </div>
  )
}

export function AlternativesSection({ alternatives }: { alternatives?: Alternative[] }) {
  if (!alternatives?.length) return null
  return (
    <div className="section" style={{ gap: 10 }}>
      <div className="section-label">ALTERNATIVES</div>
      <div className="compare-grid">
        {alternatives.map((alt) => (
          <div className="compare-cell" key={alt.term}>
            <div className="compare-cell__term">{alt.term}</div>
            <div className="compare-cell__text">{alt.usage}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ConversationSection({ conversation }: { conversation?: Turn[] }) {
  if (!conversation?.length) return null
  // Speakers alternate sides by identity, not index, so a three-line exchange
  // where one person speaks twice in a row still reads correctly.
  const firstSpeaker = conversation[0].speaker
  return (
    <div className="section" style={{ gap: 9 }}>
      <div className="section-label">CONVERSATION</div>
      {conversation.map((turn, index) => {
        const isFirstSide = turn.speaker === firstSpeaker
        return (
          <div className={`turn ${isFirstSide ? 'turn--a' : 'turn--b'}`} key={`${turn.speaker}-${index}`}>
            <div className="turn__speaker">{turn.speaker.toUpperCase()}</div>
            <div className="turn__line">{turn.text}</div>
          </div>
        )
      })}
    </div>
  )
}

export function BulletSection({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="section" style={{ gap: 8 }}>
      <div className="section-label">{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((text) => (
          <div className="bullet" key={text}>
            <div className="bullet__dot" />
            <div className="bullet__text">{text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExamplesSection({ examples }: { examples?: Example[] }) {
  if (!examples?.length) return null
  return (
    <div className="section" style={{ gap: 10 }}>
      <div className="section-label">EXAMPLES</div>
      {examples.map((example, index) => (
        <div className="section" key={`${example.sentence}-${index}`}>
          {example.context ? <div className="example__context">{example.context}</div> : null}
          <div className="example__sentence">{example.sentence}</div>
        </div>
      ))}
    </div>
  )
}

export function RememberSection({ remember }: { remember?: string[] }) {
  if (!remember?.length) return null
  return (
    <div className="remember">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--acc)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flex: 'none', marginTop: 2 }}
        aria-hidden="true"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5A5.4 5.4 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6M10 22h4" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="section-label">REMEMBER</div>
        {remember.map((note) => (
          <div key={note} style={{ fontSize: 14, lineHeight: 1.55 }}>
            {note}
          </div>
        ))}
      </div>
    </div>
  )
}
