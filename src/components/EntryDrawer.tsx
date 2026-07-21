import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { WheelEntry } from '../types/wheel'

interface EntryDrawerProps {
  entries: WheelEntry[]
  isOpen: boolean
  isSpinning: boolean
  onToggle: () => void
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onImport: (names: string[]) => void
  onExport: () => void
}

export function EntryDrawer({
  entries,
  isOpen,
  isSpinning,
  onToggle,
  onAdd,
  onRemove,
  onClear,
  onImport,
  onExport,
}: EntryDrawerProps) {
  const [name, setName] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAtMaximum = entries.length >= 30

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || isAtMaximum || isSpinning) return
    onAdd(trimmedName)
    setName('')
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const parsed: unknown = JSON.parse(await file.text())
      const rawNames = Array.isArray(parsed)
        ? parsed
        : typeof parsed === 'object' && parsed !== null && 'names' in parsed
          ? (parsed as { names: unknown }).names
          : null

      if (!Array.isArray(rawNames) || !rawNames.every((item) => typeof item === 'string')) {
        throw new Error('Choose a wheel JSON file containing a names list.')
      }

      const importedNames = rawNames.map((item) => item.trim()).filter(Boolean)
      if (importedNames.length > 30) throw new Error('A wheel can contain no more than 30 names.')
      if (importedNames.some((item) => item.length > 28)) throw new Error('Each imported name must be 28 characters or fewer.')

      onImport(importedNames)
      setFileMessage(`Imported ${importedNames.length} ${importedNames.length === 1 ? 'name' : 'names'}.`)
    } catch (error) {
      setFileMessage(error instanceof Error ? error.message : 'The JSON file could not be imported.')
    }
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
          <p>Create a list of up to 30 names. Add at least five when you are ready to spin.</p>
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

        <div className="file-actions" aria-label="Save and load wheel names">
          <button type="button" onClick={onExport} disabled={entries.length === 0 || isSpinning}>Export JSON</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isSpinning}>Import JSON</button>
          <button type="button" className="clear-list" onClick={onClear} disabled={entries.length === 0 || isSpinning}>Clear all</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
        {fileMessage && <p className="file-message" role="status">{fileMessage}</p>}

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
                disabled={isSpinning}
                aria-label={`Remove ${entry.label}`}
                title={`Remove ${entry.label}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>

        {entries.length < 5 && <p className="drawer-note">Add {5 - entries.length} more {5 - entries.length === 1 ? 'name' : 'names'} to enable spinning.</p>}
      </div>
    </aside>
  )
}
