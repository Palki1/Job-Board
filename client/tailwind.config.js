/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1E3A5F",
          50: "#EAF0F6",
          100: "#CBDAE8",
          600: "#274C74",
          700: "#1E3A5F",
          800: "#152B47",
          900: "#0D1B2E",
        },
        teal: {
          DEFAULT: "#2DD4BF",
          50: "#E9FBF8",
          100: "#C7F5EE",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
        },
        amber: {
          DEFAULT: "#F5A524",
        },
        ink: "#1F2937",
        muted: "#6B7280",
        paper: "#FAFAF9",
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.06)",
        cardHover: "0 8px 24px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
