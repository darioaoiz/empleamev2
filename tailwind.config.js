/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE0EC',
          200: '#FFC5D9',
          300: '#FF9BBD',
          400: '#FF6B9D',
          500: '#F0417E',
          600: '#E8296A',
          700: '#C21A56',
          800: '#A01848',
          900: '#85193D',
        },
        mauve: {
          100: '#F9E8F0',
          200: '#F2D0E2',
          300: '#E8C4D8',
          400: '#D4A5C0',
          500: '#C07DA4',
          600: '#A85A88',
        },
        navy: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          DEFAULT: '#2563eb',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        brand: {
          pink: '#F2B8CE',
          rose: '#E8829F',
          mauve: '#D4A0BB',
          light: '#FFF0F5',
          navy: '#1E3A5F',
          charcoal: '#2C3E50',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(212, 160, 187, 0.25)',
        'soft-lg': '0 8px 40px -8px rgba(212, 160, 187, 0.35)',
        'card': '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(212, 160, 187, 0.3)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.08)',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FFF0F5 0%, #FFE0EC 50%, #F9E8F0 100%)',
        'gradient-brand': 'linear-gradient(135deg, #F2B8CE 0%, #D4A0BB 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFF0F5 0%, #FFE8F2 40%, #F5D0E8 100%)',
        'gradient-navy': 'linear-gradient(135deg, #1E3A5F 0%, #2C3E50 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
