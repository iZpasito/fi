/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,Jsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url(/src/assets/campus1.png')",
      }
    },
  },
  plugins: [],
}