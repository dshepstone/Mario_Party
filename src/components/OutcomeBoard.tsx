import type { WheelEntry } from '../types/wheel'

interface OutcomeBoardProps {
  title: string
  entries: WheelEntry[]
  variant: 'winner' | 'lost'
}

export function OutcomeBoard({ title, entries, variant }: OutcomeBoardProps) {
  return (
    <section className={`outcome-board outcome-board--${variant}`} aria-label={title}>
      <div className="outcome-board-heading">
        <h2>{title}</h2>
        <span>{entries.length}</span>
      </div>
      {entries.length > 0 ? (
        <ol>
          {entries.map((entry) => <li key={entry.id}>{entry.label}</li>)}
        </ol>
      ) : (
        <p>No names yet</p>
      )}
    </section>
  )
}
