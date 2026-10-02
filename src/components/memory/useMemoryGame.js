import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DIFFICULTIES,
  buildDeck,
  loadBestTimes,
  saveBestTimes,
} from './gameLogic'

const MISMATCH_DELAY = 900

export default function useMemoryGame() {
  const [difficulty, setDifficulty] = useState('easy')
  const [cards, setCards] = useState(() => buildDeck(DIFFICULTIES.easy.pairs))
  const [moves, setMoves] = useState(0)
  const [status, setStatus] = useState('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [bestTimes, setBestTimes] = useState(loadBestTimes)

  const cardsRef = useRef(cards)
  const statusRef = useRef('idle')
  const difficultyRef = useRef('easy')
  const bestTimesRef = useRef(bestTimes)
  const flippedRef = useRef([])
  const mismatchTimeoutRef = useRef(null)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const accumulatedRef = useRef(0)

  const updateCards = useCallback((updater) => {
    const prev = cardsRef.current
    const next = typeof updater === 'function' ? updater(prev) : updater
    cardsRef.current = next
    setCards(next)
  }, [])

  const getElapsed = useCallback(() => {
    return accumulatedRef.current + (startTimeRef.current ? Date.now() - startTimeRef.current : 0)
  }, [])

  const tick = useCallback(() => {
    if (startTimeRef.current) {
      setElapsedMs(accumulatedRef.current + (Date.now() - startTimeRef.current))
    }
  }, [])

  const startTimer = useCallback(() => {
    if (intervalRef.current) return
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(tick, 200)
  }, [tick])

  const pauseTimer = useCallback(() => {
    if (!intervalRef.current) return
    clearInterval(intervalRef.current)
    intervalRef.current = null
    accumulatedRef.current += Date.now() - (startTimeRef.current || Date.now())
    startTimeRef.current = null
    setElapsedMs(accumulatedRef.current)
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (startTimeRef.current) {
      accumulatedRef.current += Date.now() - startTimeRef.current
      startTimeRef.current = null
    }
    setElapsedMs(accumulatedRef.current)
  }, [])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    accumulatedRef.current = 0
    startTimeRef.current = null
    setElapsedMs(0)
  }, [])

  const clearMismatchTimeout = useCallback(() => {
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current)
      mismatchTimeoutRef.current = null
    }
  }, [])

  const finishGame = useCallback(() => {
    stopTimer()
    const finalMs = getElapsed()
    statusRef.current = 'won'
    setStatus('won')
    const diff = difficultyRef.current
    const prevBest = bestTimesRef.current[diff]
    if (!prevBest || finalMs < prevBest) {
      const next = { ...bestTimesRef.current, [diff]: finalMs }
      bestTimesRef.current = next
      saveBestTimes(next)
      setBestTimes(next)
    }
  }, [stopTimer, getElapsed])

  const flip = useCallback(
    (uid) => {
      if (statusRef.current === 'won') return
      const card = cardsRef.current.find((c) => c.uid === uid)
      if (!card || card.state !== 'faceDown') return
      if (flippedRef.current.length >= 2) return

      if (statusRef.current === 'idle') {
        statusRef.current = 'playing'
        setStatus('playing')
        startTimer()
      }

      const nextFlipped = [...flippedRef.current, uid]
      flippedRef.current = nextFlipped
      updateCards((prev) =>
        prev.map((c) => (c.uid === uid ? { ...c, state: 'flipped' } : c)),
      )

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1)
        const [firstUid, secondUid] = nextFlipped
        const first = cardsRef.current.find((c) => c.uid === firstUid)
        const second = cardsRef.current.find((c) => c.uid === secondUid)
        const isMatch = first.techId === second.techId

        if (isMatch) {
          flippedRef.current = []
          updateCards((prev) =>
            prev.map((c) =>
              c.uid === firstUid || c.uid === secondUid ? { ...c, state: 'matched' } : c,
            ),
          )
          const matchedPairs = cardsRef.current.filter((c) => c.state === 'matched').length / 2
          if (matchedPairs === DIFFICULTIES[difficultyRef.current].pairs) {
            finishGame()
          }
        } else {
          mismatchTimeoutRef.current = setTimeout(() => {
            flippedRef.current = []
            updateCards((prev) =>
              prev.map((c) =>
                c.uid === firstUid || c.uid === secondUid ? { ...c, state: 'faceDown' } : c,
              ),
            )
            mismatchTimeoutRef.current = null
          }, MISMATCH_DELAY)
        }
      }
    },
    [updateCards, startTimer, finishGame],
  )

  const startNewGame = useCallback(
    (nextDifficulty) => {
      clearMismatchTimeout()
      resetTimer()
      const diff = nextDifficulty || difficultyRef.current
      difficultyRef.current = diff
      setDifficulty(diff)
      const deck = buildDeck(DIFFICULTIES[diff].pairs)
      cardsRef.current = deck
      setCards(deck)
      flippedRef.current = []
      setMoves(0)
      statusRef.current = 'idle'
      setStatus('idle')
    },
    [clearMismatchTimeout, resetTimer],
  )

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (statusRef.current === 'playing') pauseTimer()
      } else if (statusRef.current === 'playing' && !intervalRef.current) {
        startTimer()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [pauseTimer, startTimer])

  useEffect(() => {
    return () => {
      clearMismatchTimeout()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [clearMismatchTimeout])

  return {
    difficulty,
    cards,
    moves,
    status,
    elapsedMs,
    bestTimes,
    flip,
    startNewGame,
  }
}
