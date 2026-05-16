import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          100: "#EFEDE9",
          300: "#C9C9C9",
          500: "#6E7A74",
          700: "#3D3D3D",
          900: "#17211D",
        },
        cream: "#FAF8F4",
        accent: {
          DEFAULT: "#1F7A6B",
          deep: "#185E53",
          soft: "#DDF4EC",
        },
        income: {
          DEFAULT: "#1F7A4B",
          bg: "#D8F5E5",
        },
        expense: {
          DEFAULT: "#A03A3A",
          bg: "#FFE7E7",
        },
        tax: {
          DEFAULT: "#8A6418",
          bg: "#FFF2D9",
        },
        reserve: "#9A8654",
        danger: "#A6463A",
        hair: "rgba(23,33,29,0.06)",
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
