import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: {
          50:  '#E8EAF0',
          100: '#C5CAD8',
          200: '#9CA5BB',
          300: '#73809E',
          400: '#536283',
          500: '#334468',
          600: '#1E2C45',
          700: '#131C2E',
          800: '#0D1525',
          900: '#07090F',
          950: '#040609',
        },
        gold: {
          50:  '#FBF5E9',
          100: '#F5E7C5',
          200: '#EDD49A',
          300: '#E3BE6E',
          400: '#D4A84A',
          500: '#C9A870',
          600: '#B8903A',
          700: '#9A752A',
          800: '#7C5C1E',
          900: '#5E4415',
        },
        cream: '#F2EBE0',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(105deg, transparent 40%, rgba(201,168,112,0.15) 50%, transparent 60%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        'slide-in': 'slide-in 0.5s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,112,0)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(201,168,112,0.15)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'gold': '0 0 40px rgba(201,168,112,0.12)',
        'gold-hover': '0 0 60px rgba(201,168,112,0.25)',
        'card': '0 4px 40px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 60px rgba(0,0,0,0.6)',
        'inner-gold': 'inset 0 1px 0 rgba(201,168,112,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
