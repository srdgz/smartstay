import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D62839",
        "primary-dark": "#B81F2F",
        secondary: "#F1FAEE",
        tertiary: {
          dark: "#D62839",
          darkmode: "#E63946",
          light: "#A8DADC",
        },
        ink: "#1F2937",
        surface: "#F7F7F8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      boxShadow: {
        card: "0 6px 20px rgba(15, 23, 42, 0.08)",
        float: "0 12px 40px rgba(15, 23, 42, 0.16)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
