/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      width: {
        '400': '400px',
      },    
      animation: {
        zoomIn: "zoomIn 0.5s ease forwards",
        zoomOut: "zoomOut 0.5s ease forwards",
      },
      keyframes: {
        zoomIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        zoomOut: {
          "0%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.5)",
          },
        },
      },
    },
  },
  plugins: [],
};
