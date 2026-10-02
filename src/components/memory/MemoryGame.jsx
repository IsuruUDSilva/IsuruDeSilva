import { useEffect, useRef, useState } from 'react'
import {
  DIFFICULTIES,
  DIFFICULTY_ORDER,
  formatTime,
  getTech,
} from './gameLogic'
import useMemoryGame from './useMemoryGame'

const BUTTON =
  'rounded border border-terminal-accent px-3 py-1.5 font-display text-sm text-terminal-accent transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40'

const DIFF_BUTTON =
  'rounded border px-2 py-1 font-display text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none'

function GameButton({ onClick, label, disabled = false, className = BUTTON, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      className={className}
    >
      {children}
    </button>
  )
}

function Card({ card, index, onFlip }) {
  const tech = getTech(card.techId)
  const isFaceUp = card.state === 'flipped' || card.state === 'matched'
  const isMatched = card.state === 'matched'

  const label = isMatched
    ? `${tech.name}, matched`
    : isFaceUp
      ? `${tech.name}, face up`
      : `card ${index + 1}, face down`

  return (
    <button
      type="button"
      onClick={() => onFlip(card.uid)}
      disabled={isMatched}
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      className={`memory-card aspect-square w-full rounded-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent ${isFaceUp ? 'is-flipped' : ''}`}
    >
      <span className="memory-card-inner block h-full w-full">
        <span className="memory-card-face memory-card-back">
          <span className="font-display text-lg text-terminal-accent" aria-hidden="true">
            &lt;/&gt;
          </span>
        </span>
        <span
          className="memory-card-face memory-card-front"
          style={{
            background: '#0f1720',
            border: `1px solid ${isMatched ? '#00ff41' : `${tech.color}55`}`,
          }}
        >
          <span className="flex flex-col items-center gap-1 px-1 text-center">
            <span
              className="font-display text-sm font-semibold leading-tight"
              style={{ color: isMatched ? '#7fa18a' : tech.color }}
            >
              {tech.name}
            </span>
            {isMatched && (
              <span className="font-display text-xs text-terminal-accent" aria-hidden="true">
                ✓
              </span>
            )}
          </span>
        </span>
      </span>
    </button>
  )
}

export default function MemoryGame({ onClose }) {
  const containerRef = useRef(null)
  const confirmTimerRef = useRef(null)
  const [confirmRestart, setConfirmRestart] = useState(false)

  const {
    difficulty,
    cards,
    moves,
    status,
    elapsedMs,
    bestTimes,
    flip,
    startNewGame,
  } = useMemoryGame()

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    }
  }, [])

  const matchedPairs = cards.filter((card) => card.state === 'matched').length / 2
  const totalPairs = DIFFICULTIES[difficulty].pairs
  const accuracy = moves > 0 ? Math.round((matchedPairs / moves) * 100) : 0
  const isWon = status === 'won'
  const bestForDifficulty = bestTimes[difficulty]

  const handleRestart = () => {
    const needsConfirm = status === 'playing' && moves > 0
    if (needsConfirm && !confirmRestart) {
      setConfirmRestart(true)
      confirmTimerRef.current = setTimeout(() => setConfirmRestart(false), 3000)
      return
    }
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    setConfirmRestart(false)
    startNewGame()
  }

  const handleDifficulty = (nextDifficulty) => {
    setConfirmRestart(false)
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    startNewGame(nextDifficulty)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Memory match game"
      className="fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg/85 p-4 backdrop-blur-sm"
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-lg border border-terminal-border bg-terminal-panel shadow-terminal outline-none"
      >
        <div className="flex items-center justify-between border-b border-terminal-border/80 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-terminal-muted">
            memory match — dev playground
          </p>
          <GameButton
            onClick={onClose}
            label="Close memory match game"
            className="rounded px-1.5 text-terminal-muted transition hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none"
          >
            ✕
          </GameButton>
        </div>

        <div className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {DIFFICULTY_ORDER.map((key) => {
              const config = DIFFICULTIES[key]
              const best = bestTimes[key]
              const active = difficulty === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDifficulty(key)}
                  aria-label={`${config.label} difficulty, ${config.pairs} pairs${best ? `, best ${formatTime(best)}` : ''}`}
                  aria-pressed={active}
                  onMouseDown={(event) => event.preventDefault()}
                  className={`${DIFF_BUTTON} ${
                    active
                      ? 'border-terminal-accent text-terminal-accent'
                      : 'border-terminal-border text-terminal-muted hover:border-terminal-accent/70 hover:text-terminal-accent'
                  }`}
                >
                  {config.label}
                  <span className="ml-1 text-terminal-muted">
                    {best ? formatTime(best) : '—'}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mb-3 grid grid-cols-4 gap-2 font-display text-xs">
            <div className="rounded border border-terminal-border px-2 py-1.5 text-center">
              <p className="text-terminal-muted">time</p>
              <p className="text-terminal-heading">{formatTime(elapsedMs)}</p>
            </div>
            <div className="rounded border border-terminal-border px-2 py-1.5 text-center">
              <p className="text-terminal-muted">moves</p>
              <p className="text-terminal-heading">{moves}</p>
            </div>
            <div className="rounded border border-terminal-border px-2 py-1.5 text-center">
              <p className="text-terminal-muted">pairs</p>
              <p className="text-terminal-heading">
                {matchedPairs}/{totalPairs}
              </p>
            </div>
            <div className="rounded border border-terminal-border px-2 py-1.5 text-center">
              <p className="text-terminal-muted">best</p>
              <p className="text-terminal-heading">
                {bestForDifficulty ? formatTime(bestForDifficulty) : '—'}
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className={`grid ${DIFFICULTIES[difficulty].grid} gap-2`}
              role="group"
              aria-label="Memory cards"
            >
              {cards.map((card, index) => (
                <Card key={card.uid} card={card} index={index} onFlip={flip} />
              ))}
            </div>

            {isWon && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-terminal-bg/85 p-4 text-center backdrop-blur-[2px]">
                <p className="font-display text-lg text-terminal-heading">all pairs matched!</p>
                <p className="mt-2 font-display text-sm text-terminal-muted">
                  time {formatTime(elapsedMs)} · moves {moves} · accuracy {accuracy}%
                </p>
                <GameButton onClick={() => startNewGame()} label="Play again" className={`${BUTTON} mt-4`}>
                  play again
                </GameButton>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p aria-live="polite" className="font-display text-xs text-terminal-muted">
              {isWon
                ? `solved in ${formatTime(elapsedMs)} — accuracy ${accuracy}%`
                : 'flip two cards at a time and find all matching pairs.'}
            </p>
            <GameButton onClick={handleRestart} label="Start a new game" className={`${BUTTON} shrink-0`}>
              {confirmRestart && status === 'playing' ? 'sure? click again' : 'new game'}
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  )
}
