interface WheelControlsProps {
  isSpinning: boolean
  canSpin: boolean
  onSpin: () => void
}

export function WheelControls({ isSpinning, canSpin, onSpin }: WheelControlsProps) {
  return (
    <div className="wheel-controls">
      <button type="button" className="spin-button" onClick={onSpin} disabled={isSpinning || !canSpin}>
        {isSpinning ? 'Spinning…' : canSpin ? 'Spin the wheel' : 'Add at least 5 names'}
      </button>
      <p>{canSpin ? 'Press the button to choose the next activity.' : 'Open the names drawer to finish setting up the wheel.'}</p>
    </div>
  )
}
