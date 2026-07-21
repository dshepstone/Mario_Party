import { useEffect, useRef } from 'react'
import type { WheelEntry } from '../types/wheel'

interface SpinWheelProps {
  entries: WheelEntry[]
  rotation: number
  isSpinning: boolean
  selectedEntryId: string | null
  onSegmentPass: () => void
  onTransitionEnd: () => void
}

const SIZE = 400
const CENTER = SIZE / 2
const RADIUS = 190

function polarToCartesian(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians),
  }
}

function describeSegment(startAngle: number, endAngle: number) {
  const start = polarToCartesian(endAngle)
  const end = polarToCartesian(startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

export function SpinWheel({
  entries,
  rotation,
  isSpinning,
  selectedEntryId,
  onSegmentPass,
  onTransitionEnd,
}: SpinWheelProps) {
  const segmentAngle = 360 / entries.length
  const wheelRef = useRef<SVGSVGElement>(null)
  const previousSegment = useRef<number | null>(null)

  useEffect(() => {
    if (!isSpinning) {
      previousSegment.current = null
      return
    }

    let animationFrame = 0
    const trackSegment = () => {
      const wheel = wheelRef.current
      if (!wheel) return

      const matrix = new DOMMatrixReadOnly(getComputedStyle(wheel).transform)
      const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI
      const normalizedAngle = (angle + 360) % 360
      const currentSegment = Math.floor(normalizedAngle / segmentAngle)

      if (previousSegment.current !== null && currentSegment !== previousSegment.current) {
        onSegmentPass()
      }
      previousSegment.current = currentSegment
      animationFrame = requestAnimationFrame(trackSegment)
    }

    animationFrame = requestAnimationFrame(trackSegment)
    return () => cancelAnimationFrame(animationFrame)
  }, [isSpinning, onSegmentPass, segmentAngle])

  return (
    <div className="wheel-shell">
      <div className="wheel-pointer" aria-hidden="true" />
      <svg
        ref={wheelRef}
        className={`wheel ${isSpinning ? 'wheel--spinning' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onTransitionEnd={onTransitionEnd}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Spin wheel with ${entries.length} choices`}
      >
        {entries.map((entry, index) => {
          const startAngle = index * segmentAngle
          const endAngle = startAngle + segmentAngle
          const labelAngle = startAngle + segmentAngle / 2
          return (
            <g key={entry.id} className={entry.id === selectedEntryId ? 'wheel-segment wheel-segment--selected' : 'wheel-segment'}>
              <path d={describeSegment(startAngle, endAngle)} fill={entry.color} />
              <text
                className="wheel-label"
                x={CENTER + 48}
                y={CENTER + 4}
                textAnchor="start"
                transform={`rotate(${labelAngle - 90} ${CENTER} ${CENTER})`}
                style={{ fontSize: entries.length > 20 ? '9px' : entries.length > 12 ? '10px' : '12px' }}
              >
                {entry.label}
              </text>
            </g>
          )
        })}
        <circle cx={CENTER} cy={CENTER} r="36" className="wheel-hub" />
      </svg>
    </div>
  )
}
