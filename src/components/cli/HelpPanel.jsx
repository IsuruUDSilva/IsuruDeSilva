import { COMMANDS } from './commands'

export default function HelpPanel({ onRun }) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-terminal-border/70 bg-terminal-panel/40 md:flex">
      <div className="border-b border-terminal-border/70 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-terminal-accent">$ help</p>
        <h2 className="mt-1 font-display text-sm font-semibold text-terminal-heading">
          command reference
        </h2>
      </div>

      <ul className="terminal-scroll flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {COMMANDS.map((c) => (
          <li key={c.name}>
            <button
              onClick={() => onRun(c.name)}
              className="group flex w-full items-baseline gap-2 rounded px-2 py-1.5 text-left transition hover:bg-terminal-accent/5"
            >
              <span className="font-display text-sm text-terminal-accent transition group-hover:text-terminal-cyan">
                {c.name}
              </span>
              <span className="truncate font-display text-xs text-terminal-muted">
                {c.description}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-terminal-border/70 px-5 py-3">
        <p className="font-display text-[11px] text-terminal-muted">
          click a command to run it, or type it in the terminal. ↑ / ↓ browse history.
        </p>
      </div>
    </aside>
  )
}
