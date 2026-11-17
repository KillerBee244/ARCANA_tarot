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
        // Astral Dusk Palette (ARCANA 2.0)
        astral: {
          night: "#111E2C",
          bg: "#192B38",
          "bg-soft": "#223846",
          surface: "#284450",
          "surface-elevated": "#385968",
          "surface-hover": "#456675",
          "text-primary": "#F4EADA",
          "text-secondary": "#C1CFD0",
          "text-muted": "#A7BBC0",
          copper: "#DAB48A",
          "copper-light": "#ECD2B3",
          lime: "#C7E9AD",
          teal: "#80BDB2",
          "border-subtle": "#45616B",
          "border-strong": "#769095",
        },
        // Ancient Wisdom Parchment Palette
        parchment: {
          DEFAULT: "#F4ECDD",
          secondary: "#E8DCC9",
          text: "#253C44",
          muted: "#52636A",
          border: "#D8C8B3",
        },
        // Backward-compatible Arcana tokens upgraded to Astral Dusk
        arcana: {
          midnight: "#111E2C",
          "midnight-surface": "#192B38",
          teal: "#284450",
          "teal-light": "#385968",
          "teal-dark": "#192B38",
          ivory: "#F4EADA",
          "ivory-muted": "#C1CFD0",
          lime: "#C7E9AD",
          "lime-dim": "#A4D283",
          copper: "#DAB48A",
          "copper-light": "#ECD2B3",
          "copper-dark": "#B58C60",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-vietnam)", "Be Vietnam Pro", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 60s linear infinite",
        "spin-reverse-slow": "spin-reverse 75s linear infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        "celestial-glow": "0 0 35px -5px rgba(199, 233, 173, 0.3)",
        "copper-glow": "0 0 25px -5px rgba(218, 180, 138, 0.35)",
        "card-3d": "0 18px 36px -8px rgba(10, 18, 28, 0.6), 0 0 1px rgba(218, 180, 138, 0.4)",
        "card-hover": "0 28px 56px -12px rgba(10, 18, 28, 0.8), 0 0 20px rgba(218, 180, 138, 0.35)",
        parchment: "0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 0 1px rgba(216, 200, 179, 0.8)",
      },
    },
  },
  plugins: [],
};
export default config;
