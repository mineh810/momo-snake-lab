import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 80px rgba(34, 197, 94, 0.16)'
      }
    }
  },
  plugins: []
};

export default config;
