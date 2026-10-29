/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        border: 'var(--border)',
        'warning-ink': 'var(--warning-ink)',
        'danger-ink': 'var(--danger-ink)',
        
        // Subject specific colors
        xs: {
          DEFAULT: '#2b5c8f',
          light: '#eef4fa',
          border: '#c5d8ea',
          dark: '#1d426a'
        },
        ml: {
          DEFAULT: '#27624a',
          light: '#eef5f1',
          border: '#c4ded3',
          dark: '#1b4534'
        },
        dl: {
          DEFAULT: '#8a4b16',
          light: '#faf2ea',
          border: '#e8d2c0',
          dark: '#63350e'
        },
        gt: {
          DEFAULT: '#1b6b68',
          light: '#ecf6f5',
          border: '#bfdedc',
          dark: '#124947'
        }
      },
      fontFamily: {
        sans: [
          '"Be Vietnam Pro"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'Consolas',
          'Menlo',
          'Monaco',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
