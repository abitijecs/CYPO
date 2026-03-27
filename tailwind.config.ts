import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: {
          DEFAULT: '#111111',
          elevated: '#1a1a1a',
        },
        border: {
          DEFAULT: '#2a2a2a',
          gold: '#3d2e1a',
        },
        gold: {
          light: '#e4c97e',
          DEFAULT: '#c9a84c',
          muted: '#7a6228',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#c8b89a',
        },
        text: {
          primary: '#f5f0e8',
          secondary: '#a89880',
          muted: '#5c5248',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer':
          'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.15) 50%, transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        fadeUp: 'fadeUp 0.6s ease-out forwards',
        slideIn: 'slideIn 0.4s ease-out forwards',
        pulse: 'pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
