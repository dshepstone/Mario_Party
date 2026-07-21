interface OutcomeControlsProps {
  selectedName: string | null
  disabled: boolean
  onLost: () => void
  onWon: () => void
}

export function OutcomeControls({ selectedName, disabled, onLost, onWon }: OutcomeControlsProps) {
  return (
    <div className="outcome-controls" aria-label="Record spin result">
      <button type="button" className="lost-button" onClick={onLost} disabled={disabled}>
        Lost
      </button>
      <button type="button" className="won-button" onClick={onWon} disabled={disabled}>
        Won
      </button>
      <p>{selectedName ? `Move ${selectedName} to a board.` : 'Spin the wheel before recording a result.'}</p>
    </div>
  )
}
