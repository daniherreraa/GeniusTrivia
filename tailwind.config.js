/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "dodger-blue": {
          50: "#edfbff",
          100: "#d7f4ff",
          200: "#b9edff",
          300: "#88e4ff",
          400: "#50d2ff",
          500: "#28b7ff",
          600: "#0496ff",
          700: "#0a81eb",
          800: "#0f67be",
          900: "#135895",
          950: "#11365a"
        },
        razzmatazz: {
          50: "#fef1f7",
          100: "#fde6f2",
          200: "#fdcde5",
          300: "#fda4cf",
          400: "#fb6bae",
          500: "#f4408f",
          600: "#e41e6b",
          700: "#d81159",
          800: "#a41044",
          900: "#88133c",
          950: "#54031f"
        }
      }
    }
  },
  plugins: []
};
