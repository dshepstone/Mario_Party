interface WheelControlsProps {
  isSpinning: boolean
  onSpin: () => void
}

export function WheelControls({ isSpinning, onSpin }: WheelControlsProps) {
  return (
    <div className="wheel-controls">
      <button type="button" className="spin-button" onClick={onSpin} disabled={isSpinning}>
        {isSpinning ? 'Spinning…' : 'Spin the wheel'}
      </button>
      <p>Press the button to choose the next activity.</p>
    </div>
  )
}
