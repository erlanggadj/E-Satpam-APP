/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F47B20",
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: {
          primary: "#111827",
          secondary: "#6B7280"
        },
        status: {
          success: "#10B981",
          alert: "#EF4444",
          pending: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
