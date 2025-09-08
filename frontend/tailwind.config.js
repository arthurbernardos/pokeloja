/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pokemon-blue': '#1E40AF',
        'pokemon-blue-light': '#3B82F6',
        'pokemon-red': '#DC2626',
        'pokemon-red-light': '#EF4444',
        'pokemon-yellow': '#F59E0B',
        'pokemon-yellow-light': '#FDE047',
        'pokemon-green': '#16A34A',
        'pokemon-purple': '#9333EA',
        'pokemon-orange': '#EA580C',
        'pokemon-cyan': '#0891B2',
        'rarity-common': '#9CA3AF',
        'rarity-uncommon': '#22D3EE',
        'rarity-rare': '#A855F7',
        'rarity-ultra': '#F59E0B',
        'rarity-secret': '#EF4444',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'card-hover': 'cardHover 0.3s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3B82F6, 0 0 10px #3B82F6' },
          '100%': { boxShadow: '0 0 10px #3B82F6, 0 0 20px #3B82F6, 0 0 30px #3B82F6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        cardHover: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-5px) scale(1.02)' },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-purple': '0 0 20px rgba(147, 51, 234, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
