/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        knicks: {
          blue:      '#006BB6',
          'blue-d':  '#005a9e',
          'blue-dd': '#004380',
          orange:    '#F58426',
          'orange-d':'#d4711f',
        },
        navy: {
          900: '#080f1c',
          800: '#0d1829',
          750: '#0f1f38',
          700: '#142850',
          600: '#1a3360',
          500: '#1e3a6e',
          border: '#1e3557',
        },
      },
      keyframes: {
        glowOrange: {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(245,132,38,0.4)' },
          '50%':      { boxShadow: '0 0 0 7px rgba(245,132,38,0.05)' },
        },
        glowBlue: {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(0,107,182,0.4)' },
          '50%':      { boxShadow: '0 0 0 7px rgba(0,107,182,0.05)' },
        },
        pulseVoting: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,132,38,0.5)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(245,132,38,0)' },
        },
      },
      animation: {
        'glow-orange':  'glowOrange 2s ease-in-out infinite',
        'glow-blue':    'glowBlue 2s ease-in-out infinite',
        'pulse-voting': 'pulseVoting 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

