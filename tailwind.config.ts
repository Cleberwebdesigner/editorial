/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F8EF7",
        success: "#22C55E",
        warning: "#F7C948",
        alert: "#F97316",
        info: "#4ECDC4",
        creative: "#A78BFA",
        danger: "#EF4444",
        neutral: "#6B7280",
        background: "#0A0A0F",
        surface: "#111118",
        border: "#1E1E2E",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
      },
    },
  },
  plugins: [],
};
