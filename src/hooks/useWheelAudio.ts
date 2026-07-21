import { useCallback, useEffect, useRef } from 'react'

export function useWheelAudio() {
  const audioContext = useRef<AudioContext | null>(null)

  const primeAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    if (audioContext.current.state === 'suspended') {
      void audioContext.current.resume()
    }
  }, [])

  const playClick = useCallback(() => {
    const context = audioContext.current
    if (!context || context.state !== 'running') return

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(950, now)
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.025)
    gain.gain.setValueAtTime(0.055, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.03)
  }, [])

  useEffect(() => {
    return () => {
      if (audioContext.current) void audioContext.current.close()
    }
  }, [])

  return { primeAudio, playClick }
}
