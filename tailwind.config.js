/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        raw: {
          bg: "#140e0c",          // Dark espresso background matching brand logo
          card: "#1b1210",        // Card background
          border: "#2e211d",      // Subtly highlighted border
          gold: "#c69255",        // Signature bronze gold accent from logo mark
          goldHover: "#d4a366",   // Hover gold accent
          goldLight: "#f4e8d3",   // Subtle gold tint for highlights
          ivory: "#f9f6f0",       // Primary high-contrast luxury text color
          muted: "#a89b95",       // Secondary muted text
          darkMuted: "#3a2b26",   // Muted backgrounds
          charcoal: "#241b18",    // Input & drawer background
          accent: "#b07b41",      // Deep amber accent
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
