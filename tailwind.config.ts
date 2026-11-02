import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        arabee: {
          ink: "#19352F",
          green: "#2E8B62",
          mint: "#EAF7EF",
          orange: "#F39A32",
          cream: "#FFFDF7",
          rose: "#F06B75"
        }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(28, 65, 50, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
