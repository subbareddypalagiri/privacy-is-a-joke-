/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./popup.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FDFBF7',   // Crisp Alabaster White with warm tint
          100: '#F7F2EB',  // Warm Light Cream Sand
          200: '#EFE7DC',  // Soft Latte
          300: '#E0D2C1',  // Sandstone
          400: '#C4AFA0',  // Warm Taupe
          500: '#9C6644',  // Signature Light Caramel / Terracotta Umber
          600: '#7F4F24',  // Rich Roasted Coffee
          700: '#58310E',  // Deep Espresso
          800: '#3D220A',  // Dark Umber
          900: '#261405',  // Midnight Roast
        },
        ghost: {
          50: '#F2FAF5',
          100: '#DCF3E4',
          500: '#2A7B4C',  // Elegant Sage Forest Green
          600: '#1E5E38',
        },
        shield: {
          base: '#FAF7F2',   // Canvas Base (Warm White)
          card: '#FFFFFF',   // Card Surface (Pure White)
          cardAlt: '#F5EFEB',// Card Accent
          border: '#E8DFD5', // Subtle Warm Border
          borderHover: '#D4C4B5',
          accent: '#9C6644', // Warm Light Brown / Caramel
          accentLight: '#E8D8C8',
          text: '#2B2118',   // Deep Charcoal Umber
          textMuted: '#7D6F62',
        }
      },
      fontFamily: {
        bungee: ['Bungee', 'Bungee Tint', 'sans-serif'],
        bungeeTint: ['Bungee Tint', 'sans-serif'],
        display: ['Bungee', 'Bungee Tint', 'sans-serif'],
        sans: ['Bungee', 'Bungee Tint', 'sans-serif'],
        mainTitle: ['Bungee', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Space Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(61, 34, 10, 0.05), 0 1px 2px rgba(61, 34, 10, 0.03)',
        'warm-md': '0 4px 12px -2px rgba(61, 34, 10, 0.08), 0 2px 6px -1px rgba(61, 34, 10, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(61, 34, 10, 0.1), 0 4px 10px -2px rgba(61, 34, 10, 0.04)',
        'warm-glow': '0 0 20px rgba(156, 102, 68, 0.22)',
        'warm-glow-lg': '0 0 40px rgba(156, 102, 68, 0.35)',
        'emerald-glow': '0 0 20px rgba(42, 123, 76, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'ripple-1': 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'ripple-2': 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) 1s infinite',
        'ripple-3': 'ripple 3s cubic-bezier(0, 0.2, 0.8, 1) 2s infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'ripple': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
