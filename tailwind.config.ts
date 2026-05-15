import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          100: "#EFEDE9",
          300: "#C9C9C9",
          500: "#7A7A7A",
          700: "#3D3D3D",
          900: "#1A1A1A",
        },
        cream: "#F7F4EF",
        accent: {
          DEFAULT: "#2E5D4A",
          soft: "#E6EFEA",
        },
        income: "#2E5D4A",
        expense: "#8A4A3B",
        reserve: "#9A8654",
        danger: "#A6463A",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["56px", { lineHeight: "60px", fontWeight: "600" }],
        h1: ["28px", { lineHeight: "34px", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-strong": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.04)",
        hero: "0 2px 4px rgba(26,26,26,0.05), 0 16px 40px rgba(26,26,26,0.06)",
        fab: "0 6px 20px rgba(46,93,74,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
