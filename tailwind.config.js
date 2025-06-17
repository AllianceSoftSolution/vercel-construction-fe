/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        caveat: ["Caveat", "sans-serif"],
        afacad: ["Afacad", "sans-serif"],
      },
      colors: {
        primary: "#FC8908",
        buttonColor: "#222222",
      },
    },
  },
  plugins: [],
};
