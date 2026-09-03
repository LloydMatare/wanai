/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: '#e4e4e7',
        input: '#e4e4e7',
        ring: '#8b5cf6',
        background: '#ffffff',
        foreground: '#18181b',
        primary: {
          DEFAULT: '#8b5cf6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#0ea5e9',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#18181b',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#18181b',
        },
        success: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#18181b',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
