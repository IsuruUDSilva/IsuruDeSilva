import { useEffect, useRef } from 'react'
import { GAMES } from './gameRegistry'

const BUTTON =
  'rounded border border-terminal-accent px-3 py-1.5 font-display text-sm text-terminal-accent transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none'

export default function GamesMenu({ onSelect, onClose }) {
  const containerRef = useRef(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dev playground — games menu"
      className="fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg/85 p-4 backdrop-blur-sm"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="w-full max-w-sm rounded-lg border border-terminal-border bg-terminal-panel shadow-terminal outline-none"
      >
        <div className="flex items-center justify-between border-b border-terminal-border/80 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-terminal-muted">
            dev playground
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close games menu"
            className="rounded px-1.5 text-terminal-muted transition hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <p className="prompt-line">$ ls playground/games/</p>

          <ul className="mt-4 space-y-2">
            {GAMES.map((game) => (
              <li key={game.id}>
                <button
                  type="button"
                  onClick={() => onSelect(game.id)}
                  aria-label={`Play ${game.name}`}
                  className="group flex w-full flex-col rounded border border-terminal-border px-3 py-2 text-left transition hover:border-terminal-accent/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none"
                >
                  <span className="font-display text-sm text-terminal-accent transition group-hover:text-terminal-cyan">
                    ./{game.id}.sh
                  </span>
                  <span className="mt-0.5 font-display text-xs text-terminal-muted">
                    {game.name} — {game.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-4 font-display text-xs text-terminal-muted">
            run <span className="text-terminal-accent">games</span> to reopen this menu, or use{' '}
            <span className="text-terminal-accent">snake</span> /{' '}
            <span className="text-terminal-accent">memory</span> directly.
          </p>

          <button onClick={onClose} className={`${BUTTON} mt-4 w-full`} type="button">
            close
          </button>
        </div>
      </div>
    </div>
  )
}
