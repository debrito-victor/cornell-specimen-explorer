/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      colors: {
        cornell: {
          50: "#FFF1F1",
          100: "#FFD7D7",
          200: "#FFB3B3",
          300: "#FF8080",
          400: "#F74C4C",
          500: "#E31B23",
          600: "#B9141B",
          700: "#8F0E14",
          800: "#65080D",
          900: "#3B0306"
        }
      },
      boxShadow: {
        glass: "0 20px 60px -40px rgba(15, 23, 42, 0.6)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at 20% 20%, rgba(227, 27, 35, 0.25), transparent 55%), radial-gradient(circle at 80% 0%, rgba(234, 179, 8, 0.18), transparent 45%)",
      },
      backdropBlur: {
        xl: "24px",
      },
    },
  },
  plugins: [],
};
