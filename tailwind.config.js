/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1E4D3E',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          600: '#2D6A56',
          700: '#1E4D3E',
          800: '#16392E',
          900: '#0F2820',
        },
        mint: {
          light: '#F2F8F5',
          DEFAULT: '#E8F5E9',
          dark: '#CBE5D7',
        },
        earth: {
          DEFAULT: '#D97736',
          dark: '#C26D45',
          light: '#F4A261',
        },
        eco: {
          bg: '#F8FAF8',
          text: '#1B3B2B',
          muted: '#5C7A6B',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(220px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'scan-line': 'scan 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
