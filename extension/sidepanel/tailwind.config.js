/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        premium: {
          dark: "#14281d",
          light: "#fffcdc",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        typing: "typing 1.4s infinite",
      },
    },
  },
  plugins: [],
};
