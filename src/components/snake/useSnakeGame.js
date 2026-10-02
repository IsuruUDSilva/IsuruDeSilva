import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COLS,
  ROWS,
  DIRECTIONS,
  createInitialState,
  getSpeedForScore,
  isOpposite,
  step,
} from './gameLogic'

const BEST_SCORE_KEY = 'snake:best-score'

const KEY_TO_DIRECTION = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  W: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN,
  S: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  A: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
  D: DIRECTIONS.RIGHT,
}

function loadBestScore() {
  try {
    const value = Number(localStorage.getItem(BEST_SCORE_KEY))
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
  } catch {
    return 0
  }
}

export default function useSnakeGame({ onClose }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(createInitialState())
  const [status, setStatus] = useState('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(loadBestScore)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = canvas.clientWidth || COLS * 24
    const dpr = window.devicePixelRatio || 1
    const target = Math.round(size * dpr)
    if (canvas.width !== target) {
      canvas.width = target
      canvas.height = target
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)

    const cell = size / COLS
    const state = stateRef.current

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#0f1720' : '#0b1119'
        ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }

    const foodX = state.food.x * cell
    const foodY = state.food.y * cell
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(foodX + cell / 2, foodY + cell / 2, cell * 0.3, 0, Math.PI * 2)
    ctx.fill()

    state.snake.forEach((segment, index) => {
      const pad = index === 0 ? 1 : 2
      const x = segment.x * cell + pad
      const y = segment.y * cell + pad
      const w = cell - pad * 2
      ctx.fillStyle = index === 0 ? '#00e5ff' : '#00ff41'
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(x, y, w, w, 2)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, w, w)
      }
    })
  }, [])

  const setGameStatus = useCallback((next) => {
    stateRef.current.status = next
    setStatus(next)
  }, [])

  const persistBest = useCallback((value) => {
    setBest((prev) => {
      const next = Math.max(prev, value)
      try {
        localStorage.setItem(BEST_SCORE_KEY, String(next))
      } catch {
        return next
      }
      return next
    })
  }, [])

  const advance = useCallback(() => {
    const prev = stateRef.current
    const next = step(prev)
    stateRef.current = next
    draw()
    if (next.status !== prev.status) setStatus(next.status)
    if (next.score !== prev.score) setScore(next.score)
    if ((next.status === 'over' || next.status === 'won') && next.score > 0) {
      persistBest(next.score)
    }
  }, [draw, persistBest])

  const startGame = useCallback(
    (dir = DIRECTIONS.RIGHT) => {
      stateRef.current = createInitialState()
      if (!isOpposite(dir, stateRef.current.direction)) {
        stateRef.current.nextDirection = dir
        stateRef.current.direction = dir
      }
      stateRef.current.status = 'running'
      setScore(0)
      setStatus('running')
      draw()
    },
    [draw],
  )

  const togglePause = useCallback(() => {
    const current = stateRef.current
    if (current.status === 'running') setGameStatus('paused')
    else if (current.status === 'paused') setGameStatus('running')
  }, [setGameStatus])

  const changeDirection = useCallback(
    (dir) => {
      const current = stateRef.current
      if (current.status === 'idle' || current.status === 'over' || current.status === 'won') {
        startGame(dir)
        return
      }
      if (current.status !== 'running') return
      if (isOpposite(dir, current.direction)) return
      current.nextDirection = dir
    },
    [startGame],
  )

  const restart = useCallback(() => {
    startGame()
  }, [startGame])

  useEffect(() => {
    if (status !== 'running') return
    let cancelled = false
    let timerId = null
    const loop = () => {
      if (cancelled) return
      advance()
      timerId = setTimeout(loop, getSpeedForScore(stateRef.current.score))
    }
    timerId = setTimeout(loop, getSpeedForScore(stateRef.current.score))
    return () => {
      cancelled = true
      clearTimeout(timerId)
    }
  }, [status, advance])

  useEffect(() => {
    const onKeyDown = (event) => {
      const direction = KEY_TO_DIRECTION[event.key]
      if (direction) {
        event.preventDefault()
        changeDirection(direction)
        return
      }

      const isButton = event.target instanceof HTMLButtonElement

      if (event.key === ' ') {
        event.preventDefault()
        if (isButton) return
        const current = stateRef.current
        if (current.status === 'idle' || current.status === 'over' || current.status === 'won') {
          startGame()
        } else {
          togglePause()
        }
        return
      }

      if (event.key === 'Enter') {
        if (isButton) return
        event.preventDefault()
        const current = stateRef.current
        if (current.status === 'idle' || current.status === 'over' || current.status === 'won') {
          startGame()
        }
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changeDirection, togglePause, startGame, onClose])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden && stateRef.current.status === 'running') {
        setGameStatus('paused')
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [setGameStatus])

  useEffect(() => {
    draw()
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => draw())
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [draw])

  return {
    canvasRef,
    status,
    score,
    best,
    changeDirection,
    togglePause,
    restart,
    startGame,
  }
}
