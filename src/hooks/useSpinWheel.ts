import { useRef, useState } from 'react'
import type { SpinStatus, WheelEntry } from '../types/wheel'

const FULL_TURN = 360

export interface SpinMotion {
  startRotation: number
  endRotation: number
}

export function useSpinWheel(entries: WheelEntry[]) {
  const [status, setStatus] = useState<SpinStatus>('idle')
  const [rotation, setRotation] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState<WheelEntry | null>(null)
  const pendingResult = useRef<WheelEntry | null>(null)

  const spin = (): SpinMotion | null => {
    if (status === 'spinning' || entries.length < 5) return null

    const selectedIndex = Math.floor(Math.random() * entries.length)
    const segmentAngle = FULL_TURN / entries.length
    const segmentCenter = selectedIndex * segmentAngle + segmentAngle / 2
    const normalizedRotation = ((rotation % FULL_TURN) + FULL_TURN) % FULL_TURN
    const alignment = FULL_TURN - segmentCenter - normalizedRotation
    const extraTurns = 5 + Math.floor(Math.random() * 3)

    pendingResult.current = entries[selectedIndex]
    setSelectedEntry(null)
    setStatus('spinning')
    const endRotation = rotation + extraTurns * FULL_TURN + alignment
    setRotation(endRotation)
    return { startRotation: rotation, endRotation }
  }

  const finishSpin = () => {
    if (status !== 'spinning') return
    setSelectedEntry(pendingResult.current)
    setStatus('complete')
  }

  const clearSelection = () => {
    pendingResult.current = null
    setSelectedEntry(null)
    setStatus('idle')
  }

  return { status, rotation, selectedEntry, spin, finishSpin, clearSelection }
}
