import { useRef, useState } from 'react'
import type { SpinStatus, WheelEntry } from '../types/wheel'

const FULL_TURN = 360

export function useSpinWheel(entries: WheelEntry[]) {
  const [status, setStatus] = useState<SpinStatus>('idle')
  const [rotation, setRotation] = useState(0)
  const [selectedEntry, setSelectedEntry] = useState<WheelEntry | null>(null)
  const pendingResult = useRef<WheelEntry | null>(null)

  const spin = () => {
    if (status === 'spinning' || entries.length < 2) return

    const selectedIndex = Math.floor(Math.random() * entries.length)
    const segmentAngle = FULL_TURN / entries.length
    const segmentCenter = selectedIndex * segmentAngle + segmentAngle / 2
    const normalizedRotation = ((rotation % FULL_TURN) + FULL_TURN) % FULL_TURN
    const alignment = FULL_TURN - segmentCenter - normalizedRotation
    const extraTurns = 5 + Math.floor(Math.random() * 3)

    pendingResult.current = entries[selectedIndex]
    setSelectedEntry(null)
    setStatus('spinning')
    setRotation((current) => current + extraTurns * FULL_TURN + alignment)
  }

  const finishSpin = () => {
    if (status !== 'spinning') return
    setSelectedEntry(pendingResult.current)
    setStatus('complete')
  }

  return { status, rotation, selectedEntry, spin, finishSpin }
}
