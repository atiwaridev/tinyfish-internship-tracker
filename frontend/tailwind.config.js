/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: {
          DEFAULT: '#111114',
          foreground: '#fafafa',
          hover: '#18181c'
        },
        border: '#27272a',
        input: '#1c1c20',
        ring: '#52525b',
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa'
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#fafafa'
        },
        claude: {
          orange: '#d97706',
          sand: '#f5f5f4',
          warmBg: '#141210',
          warmBorder: '#292524',
          accent: '#c2410c'
        },
        vercel: {
          blue: '#0070f3',
          cyan: '#50e3c2',
          purple: '#7928ca',
          pink: '#ff0080'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(255, 255, 255, 0.07)',
        'glow-md': '0 0 25px -5px rgba(255, 255, 255, 0.1)',
        'glow-orange': '0 0 20px -5px rgba(217, 119, 6, 0.25)',
      }
    },
  },
  plugins: [],
}
