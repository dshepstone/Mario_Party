export type RoundOutcome = 'won' | 'lost' | 'tie'

interface RoundResultModalProps {
  outcome: RoundOutcome
  winnerCount: number
  lostCount: number
  onPlayAgain: () => void
}

export function RoundResultModal({ outcome, winnerCount, lostCount, onPlayAgain }: RoundResultModalProps) {
  const title = outcome === 'won' ? 'You Won!' : outcome === 'lost' ? 'You Lost' : "It's a Tie!"
  const buttonLabel = outcome === 'won' ? 'Play again' : outcome === 'lost' ? 'Try again' : 'Play again'

  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`round-modal round-modal--${outcome}`} role="dialog" aria-modal="true" aria-labelledby="round-result-title">
        <p className="eyebrow">Round complete</p>
        <h2 id="round-result-title">{title}</h2>
        <p>Winner board: {winnerCount} · Lost board: {lostCount}</p>
        <button type="button" onClick={onPlayAgain} autoFocus>{buttonLabel}</button>
      </section>
    </div>
  )
}
