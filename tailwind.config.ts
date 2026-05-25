import type { Config } from "tailwindcss";

// Color tokens consume CSS variables defined in src/app/globals.css.
// Light + dark values live in `:root` and `.dark` blocks there.
// `white` stays literal so `text-white` on accent buttons remains bright.

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          100: "rgb(var(--c-ink-100) / <alpha-value>)",
          300: "rgb(var(--c-ink-300) / <alpha-value>)",
          500: "rgb(var(--c-ink-500) / <alpha-value>)",
          700: "rgb(var(--c-ink-700) / <alpha-value>)",
          900: "rgb(var(--c-ink-900) / <alpha-value>)",
        },
        cream: "rgb(var(--c-cream) / <alpha-value>)",
        shell: "rgb(var(--c-shell) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          deep: "rgb(var(--c-accent-deep) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        income: {
          DEFAULT: "rgb(var(--c-income) / <alpha-value>)",
          bg: "rgb(var(--c-income-bg) / <alpha-value>)",
        },
        expense: {
          DEFAULT: "rgb(var(--c-expense) / <alpha-value>)",
          bg: "rgb(var(--c-expense-bg) / <alpha-value>)",
        },
        tax: {
          DEFAULT: "rgb(var(--c-tax) / <alpha-value>)",
          bg: "rgb(var(--c-tax-bg) / <alpha-value>)",
        },
        reserve: "#9A8654",
        danger: "#A6463A",
        hair: "rgb(var(--c-hair) / var(--a-hair))",
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
        "display-lg": ["64px", { lineHeight: "1.04", letterSpacing: "-0.034em", fontWeight: "600" }],
        h1: ["28px", { lineHeight: "34px", fontWeight: "600" }],
        "h1-lg": ["44px", { lineHeight: "1.1", letterSpacing: "-0.032em", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        "h2-lg": ["28px", { lineHeight: "1.15", letterSpacing: "-0.028em", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.55", fontWeight: "400" }],
        "body-strong": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "500" }],
        eyebrow: ["12px", { lineHeight: "16px", letterSpacing: "0.033em", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,33,29,0.03), 0 10px 30px rgba(23,33,29,0.04)",
        hero: "0 1px 2px rgba(23,33,29,0.04), 0 20px 50px -10px rgba(31,122,107,0.18)",
        nav: "0 1px 2px rgba(23,33,29,0.04), 0 10px 30px rgba(23,33,29,0.06)",
        fab: "0 6px 20px rgba(31,122,107,0.25)",
      },
      height: {
        13: "52px",
      },
      minHeight: {
        13: "52px",
      },
    },
  },
  plugins: [],
};

export default config;
