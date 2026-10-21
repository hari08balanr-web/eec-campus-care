/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'surface-theme': 'var(--surface)',
        'bg-theme': 'var(--bg)',
        'text-theme': 'var(--text)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.6) inset',
        'glass-hover': '0 14px 40px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(255, 255, 255, 0.8) inset',
        'glow-primary': '0 0 25px -5px var(--primary-glow)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
