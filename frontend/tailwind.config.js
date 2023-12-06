/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8F8F8",
        text: "#0E0E0E",
        textDim: "#727272",
        primary: "#FFE4BE",
        primaryShade: "#BEA889",
        secondary: "#191919",
        secondaryShade: "#2C2C2C",
        accent: "#FFE88F",
        error: "#E43C3C",
        sucess: "#34C955",
      },
      fontFamily: {
        bauhausRegular: ["Bauhaus-Regular", "sans-serif"],
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
}
