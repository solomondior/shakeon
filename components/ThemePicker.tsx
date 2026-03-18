'use client'
import { THEMES, type Theme } from '@/lib/themes'

interface ThemePickerProps {
  selected: string
  onChange: (theme: Theme) => void
}

export default function ThemePicker({ selected, onChange }: ThemePickerProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
      <span className="text-[7px] text-gray-400 mr-1" style={{ fontFamily: 'var(--font-pixel)' }}>
        style
      </span>
      {THEMES.map(theme => (
        <button
          key={theme.id}
          onClick={() => onChange(theme)}
          title={theme.name}
          className={`w-9 h-9 rounded-lg border text-lg transition-all hover:-translate-y-0.5
            ${selected === theme.id
              ? 'border-black shadow-[2px_2px_0_#111] -translate-y-0.5'
              : 'border-gray-200 hover:border-gray-400'
            }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}
