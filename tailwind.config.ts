import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'offset':    '4px 4px 0 #111',
        'offset-sm': '3px 3px 0 #111',
        'offset-xs': '2px 2px 0 #111',
      },
    },
  },
  plugins: [],
}

export default config
