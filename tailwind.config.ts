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
        arcana: {
          midnight: "#0B1020",
          "midnight-surface": "#0F162B",
          teal: "#172B38",
          "teal-light": "#223E50",
          "teal-dark": "#0E1A23",
          ivory: "#E9DFC9",
          "ivory-muted": "#B5AA94",
          lime: "#C6F68D",
          "lime-dim": "#A0D462",
          copper: "#DAA87B",
          "copper-light": "#F2CBA4",
          "copper-dark": "#9E724C",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-vietnam)", "Be Vietnam Pro", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 60s linear infinite",
        "spin-reverse-slow": "spin-reverse 75s linear infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
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
        "celestial-glow": "0 0 35px -5px rgba(198, 246, 141, 0.25)",
        "copper-glow": "0 0 25px -5px rgba(218, 168, 123, 0.3)",
        "card-3d": "0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(218, 168, 123, 0.15)",
        "card-hover": "0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 25px rgba(198, 246, 141, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

