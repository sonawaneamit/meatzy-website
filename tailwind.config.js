/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        meatzy: {
          welldone: '#701919',   // Dark Red
          mediumrare: '#AD2323', // Primary Red
          rare: '#DE2626',       // Bright Red
          marbling: '#F5BDBD',   // Pink
          tallow: '#FFECDC',     // Cream Background
          olive: '#2D2B25',      // Primary Text / Dark
          rosemary: '#545143',   // Greenish Olive
          dill: '#847B56',       // Lighter Green
          mint: '#DAD7CC',       // Gray
          gold: '#C5A059',       // Premium Gold Accent
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        slab: ['var(--font-merriweather)', 'serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
        marker: ['var(--font-marker)', 'cursive'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}