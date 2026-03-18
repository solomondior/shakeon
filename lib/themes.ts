export interface Theme {
  id: string
  name: string
  emoji: string
  pillBg: string
  pillBorder: string
  pillText: string
  canvasBorder: string
  label: string
}

export const THEMES: Theme[] = [
  {
    id: 'classic',
    name: 'classic',
    emoji: '🤝',
    pillBg: '#FFD600',
    pillBorder: '#111',
    pillText: '#111',
    canvasBorder: '#e5e7eb',
    label: '🤝',
  },
  {
    id: 'neon',
    name: 'neon',
    emoji: '🤝',
    pillBg: '#00FF88',
    pillBorder: '#111',
    pillText: '#111',
    canvasBorder: '#e5e7eb',
    label: '💚',
  },
  {
    id: 'medieval',
    name: 'medieval',
    emoji: '⚔️',
    pillBg: '#B91C1C',
    pillBorder: '#111',
    pillText: '#fff',
    canvasBorder: '#e5e7eb',
    label: '⚔️',
  },
  {
    id: 'space',
    name: 'space',
    emoji: '🛸',
    pillBg: '#7C3AED',
    pillBorder: '#111',
    pillText: '#fff',
    canvasBorder: '#e5e7eb',
    label: '🛸',
  },
  {
    id: 'retro',
    name: 'retro',
    emoji: '🕹️',
    pillBg: '#F97316',
    pillBorder: '#111',
    pillText: '#fff',
    canvasBorder: '#e5e7eb',
    label: '🕹️',
  },
  {
    id: 'nature',
    name: 'nature',
    emoji: '🌿',
    pillBg: '#16A34A',
    pillBorder: '#111',
    pillText: '#fff',
    canvasBorder: '#e5e7eb',
    label: '🌿',
  },
]

export const DEFAULT_THEME = THEMES[0]
