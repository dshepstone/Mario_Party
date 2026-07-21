import { useState } from 'react'
import { EntryDrawer } from './components/EntryDrawer'
import { GameHeader } from './components/GameHeader'
import { OutcomeBoard } from './components/OutcomeBoard'
import { OutcomeControls } from './components/OutcomeControls'
import { ResultBanner } from './components/ResultBanner'
import { RoundResultModal, type RoundOutcome } from './components/RoundResultModal'
import { SpinWheel } from './components/SpinWheel'
import { WheelControls } from './components/WheelControls'
import { defaultEntries } from './data/defaultEntries'
import { useSpinWheel } from './hooks/useSpinWheel'
import { useWheelAudio } from './hooks/useWheelAudio'

function App() {
  const [entries, setEntries] = useState(defaultEntries)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [winnerEntries, setWinnerEntries] = useState<typeof entries>([])
  const [lostEntries, setLostEntries] = useState<typeof entries>([])
  const [roundEntries, setRoundEntries] = useState<typeof entries>([])
  const [hasRoundStarted, setHasRoundStarted] = useState(false)
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null)
  const { status, rotation, selectedEntry, spin, finishSpin, clearSelection } = useSpinWheel(entries)
  const { primeAudio, scheduleSpinClicks } = useWheelAudio()
  const isSpinning = status === 'spinning'

  const startSpin = () => {
    if (!hasRoundStarted && entries.length < 5) return
    if (!hasRoundStarted) {
      setRoundEntries(entries.map((entry) => ({ ...entry })))
      setHasRoundStarted(true)
    }
    primeAudio()
    const motion = spin()
    if (motion) scheduleSpinClicks(motion.startRotation, motion.endRotation, entries.length)
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
    clearSelection()
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }

  const importEntries = (names: string[]) => {
    const palette = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
    clearSelection()
    setWinnerEntries([])
    setLostEntries([])
    setRoundEntries([])
    setHasRoundStarted(false)
    setRoundOutcome(null)
    setEntries(names.map((label, index) => ({
      id: `imported-${Date.now()}-${index}`,
      label,
      color: palette[index % palette.length],
    })))
  }

  const clearEntries = () => {
    clearSelection()
    setEntries([])
    setWinnerEntries([])
    setLostEntries([])
    setRoundEntries([])
    setHasRoundStarted(false)
    setRoundOutcome(null)
  }

  const exportEntries = () => {
    const contents = JSON.stringify({ version: 1, names: entries.map((entry) => entry.label) }, null, 2)
    const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'party-wheel-names.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const recordOutcome = (outcome: 'won' | 'lost') => {
    if (!selectedEntry || isSpinning) return

    const remainingEntries = entries.filter((entry) => entry.id !== selectedEntry.id)
    const nextWinners = outcome === 'won' ? [...winnerEntries, selectedEntry] : winnerEntries
    const nextLost = outcome === 'lost' ? [...lostEntries, selectedEntry] : lostEntries

    setEntries(remainingEntries)
    setWinnerEntries(nextWinners)
    setLostEntries(nextLost)
    clearSelection()

    if (remainingEntries.length === 0) {
      setRoundOutcome(nextWinners.length > nextLost.length ? 'won' : nextWinners.length < nextLost.length ? 'lost' : 'tie')
    }
  }

  const playAgain = () => {
    setEntries(roundEntries.map((entry) => ({ ...entry })))
    setWinnerEntries([])
    setLostEntries([])
    setHasRoundStarted(false)
    setRoundOutcome(null)
    clearSelection()
  }

  const canSpin = entries.length > 0 && (hasRoundStarted || entries.length >= 5)

  return (
    <div className="app-layout">
      <EntryDrawer
        entries={entries}
        isOpen={isDrawerOpen}
        isSpinning={isSpinning || hasRoundStarted}
        onToggle={() => setIsDrawerOpen((open) => !open)}
        onAdd={addEntry}
        onRemove={removeEntry}
        onClear={clearEntries}
        onImport={importEntries}
        onExport={exportEntries}
      />
      <main className="app-shell">
        <GameHeader />
        <section className="game-card game-board" aria-label="Spin wheel game">
          <OutcomeBoard title="Winner board" entries={winnerEntries} variant="winner" />
          <div className="wheel-column">
            <SpinWheel
              entries={entries}
              rotation={rotation}
              isSpinning={isSpinning}
              selectedEntryId={selectedEntry?.id ?? null}
              onTransitionEnd={finishSpin}
            />
            <OutcomeControls
              selectedName={selectedEntry?.label ?? null}
              disabled={!selectedEntry || isSpinning}
              onLost={() => recordOutcome('lost')}
              onWon={() => recordOutcome('won')}
            />
          </div>
          <div className="game-panel">
            <ResultBanner result={selectedEntry} isSpinning={isSpinning} />
            <WheelControls
              isSpinning={isSpinning}
              canSpin={canSpin && !selectedEntry}
              needsOutcome={Boolean(selectedEntry)}
              onSpin={startSpin}
            />
            <div className="wheel-summary">
              <strong>{entries.length} names</strong>
              <span>Use the names drawer to customize the wheel.</span>
            </div>
          </div>
          <OutcomeBoard title="Lost board" entries={lostEntries} variant="lost" />
        </section>
      </main>
      {roundOutcome && (
        <RoundResultModal
          outcome={roundOutcome}
          winnerCount={winnerEntries.length}
          lostCount={lostEntries.length}
          onPlayAgain={playAgain}
        />
      )}
    </div>
  )
}

export default App
