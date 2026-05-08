import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-instrument)', 'Georgia', 'serif'],
        body: ['var(--font-barlow)', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'sans-serif'],
      },
      colors: {
        green: {
          DEFAULT: '#4ade80',
          dim: 'rgba(74,222,128,0.15)',
          border: 'rgba(74,222,128,0.25)',
        },
        amber: { DEFAULT: '#fbbf24' },
        blue: { DEFAULT: '#60a5fa' },
        danger: { DEFAULT: '#f87171' },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.07)',
        },
      },
      borderRadius: { DEFAULT: '9999px' },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 40%, transparent 70%, rgba(255,255,255,0.08) 100%)',
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease both',
      },
      keyframes: {
        pulse: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.45', transform: 'scale(0.6)' }},
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' }},
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' }},
      },
    },
  },
  plugins: [],
}

export default config
