/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
        },
        success: {
          DEFAULT: "#22C55E",
          dark: "#16A34A",
        },
        danger: {
          DEFAULT: "#EF4444",
          dark: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};
