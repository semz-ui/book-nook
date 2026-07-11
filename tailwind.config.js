/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        element: 'rgb(var(--color-element) / <alpha-value>)',
        selected: 'rgb(var(--color-selected) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      // Mirror the Spacing scale in src/constants/theme.ts so classes read p-three, gap-four, etc.
      spacing: {
        half: 2,
        one: 4,
        two: 8,
        three: 16,
        four: 24,
        five: 32,
        six: 64,
      },
      borderRadius: {
        two: 8,
        three: 16,
        four: 24,
        five: 32,
      },
      fontFamily: {
        sans: 'var(--font-display)',
        serif: 'var(--font-serif)',
        rounded: 'var(--font-rounded)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
};
