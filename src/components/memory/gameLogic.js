export const TECH = [
  { id: 'react', name: 'React', color: '#61dafb' },
  { id: 'javascript', name: 'JavaScript', color: '#f7df1e' },
  { id: 'typescript', name: 'TypeScript', color: '#3178c6' },
  { id: 'node', name: 'Node.js', color: '#3f9e4f' },
  { id: 'java', name: 'Java', color: '#f89820' },
  { id: 'python', name: 'Python', color: '#4b8bbe' },
  { id: 'git', name: 'Git', color: '#f05033' },
  { id: 'docker', name: 'Docker', color: '#2496ed' },
  { id: 'css', name: 'CSS', color: '#1572b6' },
  { id: 'html', name: 'HTML', color: '#e34f26' },
  { id: 'graphql', name: 'GraphQL', color: '#e10098' },
  { id: 'nextjs', name: 'Next.js', color: '#cbd5e1' },
]

export const DIFFICULTIES = {
  easy: { pairs: 6, label: 'easy', grid: 'grid-cols-3 sm:grid-cols-4' },
  medium: { pairs: 8, label: 'medium', grid: 'grid-cols-4' },
  hard: { pairs: 12, label: 'hard', grid: 'grid-cols-4 sm:grid-cols-6' },
}

export const DIFFICULTY_ORDER = ['easy', 'medium', 'hard']

export const BEST_TIMES_KEY = 'memory:best-times'

export function getTech(id) {
  return TECH.find((tech) => tech.id === id)
}

export function shuffle(array) {
  const result = array.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function buildDeck(pairCount) {
  const chosen = TECH.slice(0, pairCount)
  return shuffle(
    chosen.flatMap((tech) => [
      { uid: `${tech.id}-a`, techId: tech.id, state: 'faceDown' },
      { uid: `${tech.id}-b`, techId: tech.id, state: 'faceDown' },
    ]),
  )
}

export function formatTime(ms) {
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function loadBestTimes() {
  try {
    const raw = localStorage.getItem(BEST_TIMES_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const result = {}
    for (const [key, value] of Object.entries(parsed)) {
      const ms = Number(value)
      if (DIFFICULTIES[key] && Number.isFinite(ms) && ms > 0) result[key] = ms
    }
    return result
  } catch {
    return {}
  }
}

export function saveBestTimes(times) {
  try {
    localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times))
  } catch {
    return null
  }
  return null
}
