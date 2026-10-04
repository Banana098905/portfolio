import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f8fb',
        line: '#e2e7f0',
        mist: '#e8effc',
        navy: {
          50: '#f1f5fb',
          100: '#e3eaf6',
          200: '#c7d4ec',
          300: '#9db3dc',
          400: '#6b8bc6',
          500: '#3f64ac',
          600: '#2c4c8f',
          700: '#223b73',
          800: '#182a56',
          900: '#0f1b3a',
        },
        iris: {
          DEFAULT: '#5b4bb7',
          soft: '#eeeafc',
          line: '#d9d2f7',
        },
      },
      fontFamily: {
        sans: [
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          '"Yu Gothic UI"',
          '"Yu Gothic"',
          'Meiryo',
          'system-ui',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,27,58,0.04), 0 4px 16px rgba(15,27,58,0.05)',
        'card-hover': '0 2px 4px rgba(15,27,58,0.05), 0 12px 32px rgba(15,27,58,0.10)',
      },
      keyframes: {
        pageIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'page-in': 'pageIn 0.35s ease-out both',
        'fade-in': 'fadeIn 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
