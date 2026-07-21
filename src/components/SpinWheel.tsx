import type { WheelEntry } from '../types/wheel'

interface SpinWheelProps {
  entries: WheelEntry[]
  rotation: number
  isSpinning: boolean
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

export function SpinWheel({ entries, rotation, isSpinning, onTransitionEnd }: SpinWheelProps) {
  const segmentAngle = 360 / entries.length

  return (
    <div className="wheel-shell">
      <div className="wheel-pointer" aria-hidden="true" />
      <svg
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
            <g key={entry.id}>
              <path d={describeSegment(startAngle, endAngle)} fill={entry.color} />
              <text
                className="wheel-label"
                x={CENTER}
                y="42"
                textAnchor="middle"
                transform={`rotate(${labelAngle} ${CENTER} ${CENTER})`}
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
