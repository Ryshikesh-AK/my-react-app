module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f47f0",
        "background-dark": "#101422",
        "card-bg": "#192034",
        "input-bg": "#111522",
        "border-color": "#323f67",
        "border-light": "#232c48",
        "text-secondary": "#919fca",
        "text-muted": "#6371a3",
        "text-dim": "#556088",
      },
      fontFamily: {
        display: ["Public Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};