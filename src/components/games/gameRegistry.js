import { lazy } from 'react'

export const GAMES = [
  {
    id: 'snake',
    name: 'Snake',
    description: 'classic grid snake — arrows / WASD / swipe',
    component: lazy(() => import('../snake/SnakeGame')),
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'flip pairs of tech cards — three difficulties',
    component: lazy(() => import('../memory/MemoryGame')),
  },
]

export function getGame(id) {
  return GAMES.find((game) => game.id === id)
}
