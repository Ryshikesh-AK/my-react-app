/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core */
        primary: "#0f47f0",
        bg: "#101422",

        /* Surfaces */
        card: "#192034",
        input: "#111522",

        /* Borders */
        border: "#323f67",
        "border-light": "#232c48",

        /* Text */
        muted: "#919fca",
        dim: "#556088",

        /* Status */
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["Public Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
