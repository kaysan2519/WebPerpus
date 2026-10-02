import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F6F2",
        foreground: "#252925",
        ivory: {
          DEFAULT: "#F7F6F2",
          50: "#FAF9F6",
          100: "#F7F6F2",
          200: "#EFECE3",
          300: "#E3DFCFA",
        },
        forest: {
          DEFAULT: "#174C3C",
          hover: "#133E31",
          deep: "#12382F",
          dark: "#0C241E",
          50: "#F1F7F4",
          100: "#DEECE6",
          200: "#BCD9CF",
          500: "#174C3C",
          800: "#12382F",
          900: "#0B231D",
        },
        sage: {
          DEFAULT: "#A8B9A4",
          soft: "#E7EDE5",
          light: "#F0F4EE",
          muted: "#A8B9A4",
          dark: "#7A8E76",
        },
        charcoal: {
          DEFAULT: "#252925",
          soft: "#3A403A",
          muted: "#777D77",
          light: "#9A9E9A",
        },
        border: {
          DEFAULT: "#E5E6DF",
          subtle: "#ECEEE8",
          dark: "#D1D3C9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        editorial: ["var(--font-instrument)", "Georgia", "serif"],
        display: ["var(--font-manrope)", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 1px 3px rgba(37, 41, 37, 0.04), 0 6px 16px rgba(37, 41, 37, 0.03)",
        card: "0 2px 8px -2px rgba(23, 76, 60, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        book: "0 10px 25px -5px rgba(18, 56, 47, 0.15), 0 4px 6px -2px rgba(18, 56, 47, 0.05)",
        floating: "0 12px 30px -4px rgba(18, 56, 47, 0.08), 0 4px 8px -2px rgba(18, 56, 47, 0.04)",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
