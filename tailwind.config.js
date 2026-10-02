export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0f14',
          panel: '#0f1720',
          border: '#1e2e3f',
          heading: '#e6f5e8',
          text: '#b9d4c0',
          muted: '#7fa18a',
          accent: '#00ff41',
          cyan: '#00e5ff',
        },
      },
      fontFamily: {
        display: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        terminal:
          '0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
      },
    },
  },
  plugins: [],
}

