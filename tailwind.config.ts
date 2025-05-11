import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        defaultGreen: "#3f5a2e",
        primaryGreen: "#667c3e",
        primaryBlue: "#1d2228",
        primaryWhite: "#f0f5f1",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0.8" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0.5" },
        },
      },
      animation: {
        slideUp: "slideUp 0.1s ease-out forwards",
        slideDown: "slideDown 0.1s ease-out forwards",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".hide-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* Chrome, Safari */,
          },
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
export default config;
