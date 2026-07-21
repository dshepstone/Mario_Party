import { useState } from 'react'
import { EntryDrawer } from './components/EntryDrawer'
import { GameHeader } from './components/GameHeader'
import { ResultBanner } from './components/ResultBanner'
import { SpinWheel } from './components/SpinWheel'
import { WheelControls } from './components/WheelControls'
import { defaultEntries } from './data/defaultEntries'
import { useSpinWheel } from './hooks/useSpinWheel'
import { useWheelAudio } from './hooks/useWheelAudio'

function App() {
  const [entries, setEntries] = useState(defaultEntries)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { status, rotation, selectedEntry, spin, finishSpin } = useSpinWheel(entries)
  const { primeAudio, playClick } = useWheelAudio()
  const isSpinning = status === 'spinning'

  const startSpin = () => {
    primeAudio()
    spin()
  }

  const addEntry = (label: string) => {
    if (entries.length >= 30) return
    const palette = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
    setEntries((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        label,
        color: palette[current.length % palette.length],
      },
    ])
  }

  const removeEntry = (id: string) => {
    setEntries((current) => current.length > 5 ? current.filter((entry) => entry.id !== id) : current)
  }

  return (
    <div className="app-layout">
      <EntryDrawer
        entries={entries}
        isOpen={isDrawerOpen}
        isSpinning={isSpinning}
        onToggle={() => setIsDrawerOpen((open) => !open)}
        onAdd={addEntry}
        onRemove={removeEntry}
      />
      <main className="app-shell">
        <GameHeader />
        <section className="game-card" aria-label="Spin wheel game">
          <SpinWheel
            entries={entries}
            rotation={rotation}
            isSpinning={isSpinning}
            selectedEntryId={selectedEntry?.id ?? null}
            onSegmentPass={playClick}
            onTransitionEnd={finishSpin}
          />
          <div className="game-panel">
            <ResultBanner result={selectedEntry} isSpinning={isSpinning} />
            <WheelControls isSpinning={isSpinning} onSpin={startSpin} />
            <div className="wheel-summary">
              <strong>{entries.length} names</strong>
              <span>Use the names drawer to customize the wheel.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
