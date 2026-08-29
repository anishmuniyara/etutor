import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Text-to-speech via the browser's built-in Web Speech API.
 *
 * Chosen because it needs no API key, no network call, and no backend — which
 * matters for a static site on GitHub Pages. It is also the only option that
 * keeps working offline.
 *
 * Nearly all the code here exists to handle the API's quirks rather than to
 * speak, so they are documented where they are handled.
 */

/** Preference order — a non-English voice mangles English pronunciation badly. */
const PREFERRED_LANGS = ['en-GB', 'en-US', 'en-AU', 'en']

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const lang of PREFERRED_LANGS) {
    const exact = voices.find((v) => v.lang.replace('_', '-') === lang)
    if (exact) return exact
    const prefixed = voices.find((v) => v.lang.replace('_', '-').startsWith(lang))
    if (prefixed) return prefixed
  }
  return null
}

export function useSpeech() {
  // Read once: some embedded webviews expose no speechSynthesis at all, and the
  // caller needs to know so it can render nothing rather than a dead button.
  const [supported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
  )
  const [speaking, setSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!supported) return
    // Captured once. Some embedded webviews drop speechSynthesis from `window`
    // during their lifetime, and reaching for it again at cleanup would throw
    // inside an effect teardown — which unmounts the whole card, not just the
    // button.
    const synth = window.speechSynthesis
    if (!synth) return

    // getVoices() returns [] on the first call in Chrome — the list arrives
    // asynchronously and fires `voiceschanged`. Subscribe rather than poll.
    const load = () => {
      voiceRef.current = pickVoice(synth.getVoices())
    }
    load()
    synth.addEventListener('voiceschanged', load)

    return () => {
      synth.removeEventListener('voiceschanged', load)
      // Without this, speech carries on after navigating to another card.
      synth.cancel()
    }
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
      if (!supported || !synth || !text.trim()) return

      // Queued utterances are the default; without cancel() a double tap says
      // the word twice instead of restarting it.
      synth.cancel()

      // Built inside the handler: iOS Safari only accepts an utterance created
      // during the user gesture that triggered it.
      const utterance = new SpeechSynthesisUtterance(text)
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.lang = voiceRef.current?.lang ?? 'en-US'
      // Single words are clearer a little below normal speed.
      utterance.rate = 0.9

      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      setSpeaking(true)
      synth.speak(utterance)
    },
    [supported],
  )

  return { supported, speaking, speak }
}
