import { GameHeader } from './components/GameHeader'
import { ResultBanner } from './components/ResultBanner'
import { SpinWheel } from './components/SpinWheel'
import { WheelControls } from './components/WheelControls'
import { defaultEntries } from './data/defaultEntries'
import { useSpinWheel } from './hooks/useSpinWheel'

function App() {
  const { status, rotation, selectedEntry, spin, finishSpin } = useSpinWheel(defaultEntries)
  const isSpinning = status === 'spinning'

  return (
    <main className="app-shell">
      <GameHeader />
      <section className="game-card" aria-label="Spin wheel game">
        <SpinWheel
          entries={defaultEntries}
          rotation={rotation}
          isSpinning={isSpinning}
          onTransitionEnd={finishSpin}
        />
        <div className="game-panel">
          <ResultBanner result={selectedEntry} isSpinning={isSpinning} />
          <WheelControls isSpinning={isSpinning} onSpin={spin} />
          <div className="entry-preview">
            <h2>On the wheel</h2>
            <ul>
              {defaultEntries.map((entry) => (
                <li key={entry.id}>
                  <span className="entry-swatch" style={{ background: entry.color }} />
                  {entry.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
