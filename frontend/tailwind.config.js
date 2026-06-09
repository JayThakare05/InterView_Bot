/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#05080f',
          900: '#0a0f1e',
          800: '#0f1628',
          700: '#151e36',
          600: '#1c2844',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        glass: 'rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a0f1e 0%, #0f1628 40%, #0a1628 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(45,212,191,0.08))',
        'glow-violet': 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, transparent 70%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        glow: '0 0 30px rgba(139,92,246,0.3)',
        'glow-teal': '0 0 30px rgba(45,212,191,0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'typing': 'typing 1.2s ease-in-out infinite',
        'score-ring': 'scoreRing 1.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
