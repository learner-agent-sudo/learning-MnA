import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        panel: '#f8fafc',
        accent: '#2563eb',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
};

export default config;
