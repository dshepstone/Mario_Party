import { useCallback, useEffect, useRef } from 'react'

const SPIN_DURATION_SECONDS = 4.2
const MIN_CLICK_INTERVAL_SECONDS = 0.034

// Matches cubic-bezier(.12, .66, .08, 1) used by the wheel transition.
function bezierCoordinate(t: number, firstControl: number, secondControl: number) {
  const inverse = 1 - t
  return 3 * inverse * inverse * t * firstControl
    + 3 * inverse * t * t * secondControl
    + t * t * t
}

function timeForRotationProgress(progress: number) {
  let low = 0
  let high = 1

  // Find the curve parameter whose y value is the requested rotation progress.
  for (let iteration = 0; iteration < 18; iteration += 1) {
    const midpoint = (low + high) / 2
    const easedProgress = bezierCoordinate(midpoint, 0.66, 1)
    if (easedProgress < progress) low = midpoint
    else high = midpoint
  }

  return bezierCoordinate((low + high) / 2, 0.12, 0.08)
}

export function useWheelAudio() {
  const audioContext = useRef<AudioContext | null>(null)
  const scheduledClicks = useRef<OscillatorNode[]>([])

  const primeAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
    }
    if (audioContext.current.state === 'suspended') {
      void audioContext.current.resume()
    }
  }, [])

  const scheduleClick = useCallback((context: AudioContext, time: number) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(1250, time)
    oscillator.frequency.exponentialRampToValueAtTime(680, time + 0.014)
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.038, time + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.018)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(time)
    oscillator.stop(time + 0.02)
    scheduledClicks.current.push(oscillator)
  }, [])

  const scheduleSpinClicks = useCallback((
    startRotation: number,
    endRotation: number,
    segmentCount: number,
  ) => {
    const context = audioContext.current
    if (!context || segmentCount < 1) return

    const schedule = () => {
      const totalRotation = endRotation - startRotation
      if (totalRotation <= 0) return

      const segmentAngle = 360 / segmentCount
      const firstBoundary = Math.floor(startRotation / segmentAngle) + 1
      const lastBoundary = Math.floor((endRotation + 0.0001) / segmentAngle)
      const audioStart = context.currentTime + 0.016
      let previousClickTime = -Infinity

      scheduledClicks.current = []
      for (let boundaryIndex = firstBoundary; boundaryIndex <= lastBoundary; boundaryIndex += 1) {
        const boundaryRotation = boundaryIndex * segmentAngle
        const rotationProgress = (boundaryRotation - startRotation) / totalRotation
        const timeProgress = timeForRotationProgress(rotationProgress)
        const clickTime = audioStart + timeProgress * SPIN_DURATION_SECONDS

        if (clickTime - previousClickTime >= MIN_CLICK_INTERVAL_SECONDS) {
          scheduleClick(context, clickTime)
          previousClickTime = clickTime
        }
      }
    }

    if (context.state === 'suspended') void context.resume().then(schedule)
    else schedule()
  }, [scheduleClick])

  useEffect(() => {
    return () => {
      if (audioContext.current) void audioContext.current.close()
    }
  }, [])

  return { primeAudio, scheduleSpinClicks }
}
