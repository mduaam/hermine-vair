import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F3EFE8',
        taupe: '#A38268',
        charcoal: '#4A4642',
        black: '#1C1917',
        gold: '#C89B5C',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // 48px — Hero H1
        '2xl-serif': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }], // 32px — Section H2
        'xl-serif': ['1.5rem', { lineHeight: '1.3' }],                         // 24px — Card titles H3
        'base': ['1rem', { lineHeight: '1.6' }],                               // 16px — Body, nav, buttons
        'eyebrow': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],// 12px — uppercase labels
      },
      maxWidth: {
        'site': '1440px',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '2px',
        md: '4px',
      },
    },
  },
  plugins: [],
};

export default config;
