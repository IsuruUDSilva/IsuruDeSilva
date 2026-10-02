import { useEffect, useRef } from 'react'
import { DIRECTIONS } from './gameLogic'
import useSnakeGame from './useSnakeGame'

const BUTTON =
  'rounded border border-terminal-accent px-3 py-1.5 font-display text-sm text-terminal-accent transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40'

const PAD_BUTTON =
  'flex h-11 items-center justify-center rounded border border-terminal-border font-display text-lg text-terminal-text transition hover:border-terminal-accent/70 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none'

const STATUS_LABEL = {
  idle: 'press start or an arrow key',
  running: 'playing — space pauses',
  paused: 'paused — space resumes',
  over: 'game over',
  won: 'you win!',
}

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

function Overlay({ children }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-bg/80 p-4 text-center backdrop-blur-[2px]">
      {children}
    </div>
  )
}

export default function SnakeGame({ onClose }) {
  const containerRef = useRef(null)
  const touchStartRef = useRef(null)
  const {
    canvasRef,
    status,
    score,
    best,
    changeDirection,
    togglePause,
    restart,
    startGame,
  } = useSnakeGame({ onClose })

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const isOver = status === 'over' || status === 'won'
  const isIdle = status === 'idle'
  const isPaused = status === 'paused'

  const onTouchStart = (event) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event) => {
    const start = touchStartRef.current
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    touchStartRef.current = null
    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT)
    } else {
      changeDirection(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Snake game"
      className="fixed inset-0 z-50 flex items-center justify-center bg-terminal-bg/85 p-4 backdrop-blur-sm"
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
            snake — dev playground
          </p>
          <GameButton
            onClick={onClose}
            label="Close snake game"
            className="rounded px-1.5 text-terminal-muted transition hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent motion-reduce:transition-none"
          >
            ✕
          </GameButton>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between font-display text-sm">
            <p className="text-terminal-accent">
              score: <span className="text-terminal-heading">{score}</span>
            </p>
            <p className="text-terminal-muted">
              best: <span className="text-terminal-heading">{best}</span>
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded border border-terminal-border"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Snake game board"
              className="block w-full"
              style={{ aspectRatio: '1 / 1' }}
            />

            {isIdle && (
              <Overlay>
                <p className="font-display text-lg text-terminal-heading">snake</p>
                <p className="mt-2 max-w-[16rem] text-sm text-terminal-muted">
                  move with ↑ ↓ ← → or WASD. eat the food, avoid walls and your own tail.
                </p>
                <GameButton onClick={() => startGame()} label="Start game" className={`${BUTTON} mt-4`}>
                  start
                </GameButton>
              </Overlay>
            )}

            {isPaused && (
              <Overlay>
                <p className="font-display text-lg text-terminal-heading">paused</p>
                <GameButton onClick={togglePause} label="Resume game" className={`${BUTTON} mt-4`}>
                  resume
                </GameButton>
              </Overlay>
            )}

            {isOver && (
              <Overlay>
                <p className="font-display text-lg text-terminal-heading">
                  {status === 'won' ? 'you win!' : 'game over'}
                </p>
                <p className="mt-2 text-sm text-terminal-muted">final score: {score}</p>
                <GameButton onClick={restart} label="Play again" className={`${BUTTON} mt-4`}>
                  play again
                </GameButton>
              </Overlay>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p aria-live="polite" className="font-display text-xs text-terminal-muted">
              {STATUS_LABEL[status]}
            </p>
            <div className="flex shrink-0 gap-2">
              <GameButton
                onClick={togglePause}
                disabled={isIdle || isOver}
                label={isPaused ? 'Resume game' : 'Pause game'}
              >
                {isPaused ? 'resume' : 'pause'}
              </GameButton>
              <GameButton onClick={restart} label="Restart game">
                restart
              </GameButton>
            </div>
          </div>

          <div className="mx-auto mt-4 grid w-36 grid-cols-3 gap-1.5" aria-label="Directional controls">
            <span />
            <GameButton
              onClick={() => changeDirection(DIRECTIONS.UP)}
              label="Move up"
              className={PAD_BUTTON}
            >
              ↑
            </GameButton>
            <span />
            <GameButton
              onClick={() => changeDirection(DIRECTIONS.LEFT)}
              label="Move left"
              className={PAD_BUTTON}
            >
              ←
            </GameButton>
            <GameButton
              onClick={() => changeDirection(DIRECTIONS.DOWN)}
              label="Move down"
              className={PAD_BUTTON}
            >
              ↓
            </GameButton>
            <GameButton
              onClick={() => changeDirection(DIRECTIONS.RIGHT)}
              label="Move right"
              className={PAD_BUTTON}
            >
              →
            </GameButton>
          </div>
        </div>
      </div>
    </div>
  )
}
