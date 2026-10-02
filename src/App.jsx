import { Suspense, useRef, useState } from 'react'
import Terminal from './components/cli/Terminal'
import HelpPanel from './components/cli/HelpPanel'
import GamesMenu from './components/games/GamesMenu'
import { getGame } from './components/games/gameRegistry'

function GameLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg/85">
      <div className="rounded-lg border border-terminal-border bg-terminal-panel px-6 py-4 shadow-terminal">
        <p className="font-display text-sm text-terminal-accent">loading game…</p>
      </div>
    </div>
  )
}

function App() {
  const terminalRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeGameId, setActiveGameId] = useState(null)

  const activeGame = activeGameId ? getGame(activeGameId) : null
  const ActiveGame = activeGame?.component

  const closeAll = () => {
    setActiveGameId(null)
    setMenuOpen(false)
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-terminal-bg text-terminal-text md:flex-row">
      <main className="flex min-h-0 flex-1 flex-col">
        <Terminal
          ref={terminalRef}
          onOpenGame={(id) => (id === 'games' ? setMenuOpen(true) : setActiveGameId(id))}
        />
      </main>
      <HelpPanel onRun={(cmd) => terminalRef.current?.run(cmd)} />
      {menuOpen && !ActiveGame && (
        <GamesMenu
          onClose={() => setMenuOpen(false)}
          onSelect={(id) => {
            setMenuOpen(false)
            setActiveGameId(id)
          }}
        />
      )}
      {ActiveGame && (
        <Suspense fallback={<GameLoader />}>
          <ActiveGame onClose={closeAll} />
        </Suspense>
      )}
    </div>
  )
}

export default App
