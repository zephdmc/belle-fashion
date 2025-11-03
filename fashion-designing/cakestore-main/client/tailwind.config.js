/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'purplegradient': 'linear-gradient(to right, #FF7EE3, #c6c6c6, #FF7EE3)',
        'purplegradientv': 'linear-gradient(to bottom, #F4EAFA, #c6c6c6, #F4EAFA)',
        'purplegradientr': 'radial-gradient(circle, #FF7EE3, #c6c6c6, #FF7EE3)',
        'greengrade': 'linear-gradient(to right, #6ab6b6, #c6c6c6)',
        'gold-gradient': 'linear-gradient(to right, #EFBF04, #D4AF37)',
      },
      colors: {
        'gold': '#EFBF04',
        'purpleDark1': '#BB2A8F',
        'purpleDark': '#BB2A8F',
        'purpleLight': '#F4EAFA',
        'purpleDark2': '#BB2A8F',
        'purpleLighter': '#F4EAFA',
        'purpleLighter1': '#ede7f6',
        'white': '#FFFFFF',
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'red': '#e91e63',
        'greengrade': '#6ab6b6',
        'green': '#6ab6b6',
        primary: {
          DEFAULT: '#4A2BA0',
          light: '#ede7f6',
          dark: '#4A2BA0',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
}
