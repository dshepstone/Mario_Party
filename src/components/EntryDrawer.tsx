import { useState, type FormEvent } from 'react'
import type { WheelEntry } from '../types/wheel'

interface EntryDrawerProps {
  entries: WheelEntry[]
  isOpen: boolean
  isSpinning: boolean
  onToggle: () => void
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export function EntryDrawer({
  entries,
  isOpen,
  isSpinning,
  onToggle,
  onAdd,
  onRemove,
}: EntryDrawerProps) {
  const [name, setName] = useState('')
  const isAtMaximum = entries.length >= 30
  const isAtMinimum = entries.length <= 5

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || isAtMaximum || isSpinning) return
    onAdd(trimmedName)
    setName('')
  }

  return (
    <aside className={`entry-drawer ${isOpen ? 'entry-drawer--open' : ''}`} aria-label="Wheel names">
      <button
        type="button"
        className="drawer-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="entry-drawer-content"
      >
        <span aria-hidden="true">{isOpen ? '‹' : '›'}</span>
        <span className="sr-only">{isOpen ? 'Close names drawer' : 'Open names drawer'}</span>
      </button>

      <div id="entry-drawer-content" className="drawer-content" aria-hidden={!isOpen}>
        <div className="drawer-heading">
          <p className="eyebrow">Customize</p>
          <h2>Wheel names</h2>
          <p>Add between 5 and 30 names, activities, or prizes.</p>
        </div>

        <form className="name-form" onSubmit={handleSubmit}>
          <label htmlFor="wheel-name">Add a name</label>
          <div className="name-form-row">
            <input
              id="wheel-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={28}
              placeholder="Enter a name"
              disabled={isAtMaximum || isSpinning}
            />
            <button type="submit" disabled={!name.trim() || isAtMaximum || isSpinning}>
              Add
            </button>
          </div>
          <div className="entry-count">
            <span>{entries.length} of 30 spots</span>
            {isAtMaximum && <span>Wheel is full</span>}
          </div>
        </form>

        <ol className="name-list">
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <span className="entry-number">{index + 1}</span>
              <span className="entry-swatch" style={{ background: entry.color }} />
              <span className="entry-name" title={entry.label}>{entry.label}</span>
              <button
                type="button"
                className="remove-entry"
                onClick={() => onRemove(entry.id)}
                disabled={isAtMinimum || isSpinning}
                aria-label={`Remove ${entry.label}`}
                title={isAtMinimum ? 'The wheel needs at least 5 names' : `Remove ${entry.label}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>

        {isAtMinimum && <p className="drawer-note">Five names are required to play.</p>}
      </div>
    </aside>
  )
}
