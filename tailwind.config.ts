import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        // Deep charcoal/black - grill & header surfaces
        charcoal: {
          50: "#f5f4f3",
          100: "#e7e5e3",
          200: "#c7c2be",
          300: "#a19a94",
          400: "#726963",
          500: "#4d443f",
          600: "#362f2b",
          700: "#282320",
          800: "#1c1917",
          900: "#141210",
          950: "#0d0b0a",
        },
        // Ember red - the flame's outer glow, primary CTA color
        ember: {
          50: "#fdf2f1",
          100: "#fbe1de",
          200: "#f7c2bc",
          300: "#f0968c",
          400: "#e6685a",
          500: "#d8402d",
          600: "#c22a1c",
          700: "#a11f16",
          800: "#851d17",
          900: "#701c18",
        },
        // Flame gold/orange - the inner flame, highlights & accents
        gold: {
          50: "#fff8ec",
          100: "#ffecc7",
          200: "#ffd68a",
          300: "#ffbb4d",
          400: "#fda021",
          500: "#f7820c",
          600: "#db6207",
          700: "#b6460a",
          800: "#93380f",
          900: "#792f10",
        },
        // Warm cream - background paper tone from the brand mark
        cream: {
          50: "#fdfbf6",
          100: "#f9f3e6",
          200: "#f1e6cc",
          300: "#e6d4ab",
        },
      },
    },
  },
  plugins: [],
};

export default config;
