import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-tajawal)", "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f4f9f1",
          100: "#e5f1dc",
          200: "#c9e2ba",
          300: "#a3cd8b",
          400: "#78b45c",
          500: "#579a3c",
          600: "#437c2d",
          700: "#356225",
          800: "#2c4e21",
          900: "#25411d",
        },
        gold: {
          400: "#e8c46b",
          500: "#d4a83e",
          600: "#b58a2c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
