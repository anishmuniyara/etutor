import { useSpeech } from '../hooks/useSpeech'
import { Speaker } from './Icons'

/**
 * Reads a word aloud. Renders nothing when the browser has no speech support —
 * a button that silently does nothing is worse than no button at all.
 */
export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { supported, speaking, speak } = useSpeech()
  if (!supported) return null

  return (
    <button
      type="button"
      className="speak-button"
      data-speaking={speaking}
      aria-label={label ?? `Pronounce ${text}`}
      onClick={() => speak(text)}
    >
      <Speaker size={20} active={speaking} />
    </button>
  )
}
