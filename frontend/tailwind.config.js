/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          blue: '#3B4CCA',
          yellow: '#FFDE00',
          red: '#FF0000',
        },
      },
    },
  },
  plugins: [],
}
