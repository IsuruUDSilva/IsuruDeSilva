export const COLS = 20
export const ROWS = 20

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const BASE_SPEED = 160
export const MIN_SPEED = 70

export function createInitialState() {
  const center = Math.floor(COLS / 2)
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    food: { x: center + 4, y: center },
    score: 0,
    status: 'idle',
  }
}

export function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}

export function randomCell(exclude = []) {
  const occupied = new Set(exclude.map((cell) => `${cell.x},${cell.y}`))
  const free = []
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

export function getSpeedForScore(score) {
  return Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / 5) * 10)
}

export function step(state) {
  if (state.status !== 'running') return state

  const direction = state.nextDirection
  const head = state.snake[0]
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y }

  const hitWall =
    nextHead.x < 0 || nextHead.x >= COLS || nextHead.y < 0 || nextHead.y >= ROWS

  const ate = nextHead.x === state.food.x && nextHead.y === state.food.y
  const body = ate ? state.snake : state.snake.slice(0, -1)
  const hitSelf = body.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
  )

  if (hitWall || hitSelf) {
    return { ...state, direction, status: 'over' }
  }

  const snake = ate ? [nextHead, ...state.snake] : [nextHead, ...state.snake.slice(0, -1)]

  let food = state.food
  let score = state.score
  let status = state.status

  if (ate) {
    score += 1
    const nextFood = randomCell(snake)
    if (nextFood) {
      food = nextFood
    } else {
      status = 'won'
    }
  }

  return { ...state, snake, direction, food, score, status }
}
