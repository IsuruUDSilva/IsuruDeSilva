import { useRef } from 'react'
import Terminal from './components/cli/Terminal'
import HelpPanel from './components/cli/HelpPanel'

function App() {
  const terminalRef = useRef(null)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-terminal-bg text-terminal-text md:flex-row">
      <main className="flex min-h-0 flex-1 flex-col">
        <Terminal ref={terminalRef} />
      </main>
      <HelpPanel onRun={(cmd) => terminalRef.current?.run(cmd)} />
    </div>
  )
}

export default App
