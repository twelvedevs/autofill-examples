/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e8402a",
          hover: "#c73628",
          light: "#fef2f2",
          muted: "#fecaca",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8f8f9",
          page: "#f9fafb",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};
