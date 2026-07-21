import type { WheelEntry } from '../types/wheel'

interface ResultBannerProps {
  result: WheelEntry | null
  isSpinning: boolean
}

export function ResultBanner({ result, isSpinning }: ResultBannerProps) {
  const message = isSpinning
    ? 'The wheel is spinning…'
    : result
      ? `You landed on ${result.label}!`
      : 'Ready for your first spin?'

  return (
    <div className={`result-banner ${result ? 'result-banner--winner' : ''}`} aria-live="polite">
      {message}
    </div>
  )
}
