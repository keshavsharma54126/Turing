/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A2F4F',
        secondary: '#917FB3',
        accent: '#E5BEEC',
        background: '#FDE2F3',
        'text-primary': '#2A2F4F',
        'text-secondary': '#917FB3',
        'dashboard-primary': '#1B4D3E',
        'dashboard-secondary': '#2A6B5D',
        'dashboard-accent': '#5B9A8B',
        'dashboard-bg': '#DCE8E3',
        'dashboard-text': '#1B4D3E',
        'dashboard-light': '#F0F5F3',
        'dashboard-hover': '#153D31',
      },
      boxShadow: {
        'brutal-sm': '4px 4px 0 0 var(--tw-shadow-color)',
        'brutal': '8px 8px 0 0 var(--tw-shadow-color)',
        'brutal-lg': '12px 12px 0 0 var(--tw-shadow-color)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': `
          linear-gradient(45deg, rgba(51, 51, 51, 0.05) 25%, transparent 25%) -50px 0,
          linear-gradient(-45deg, rgba(51, 51, 51, 0.05) 25%, transparent 25%) -50px 0,
          linear-gradient(45deg, transparent 75%, rgba(51, 51, 51, 0.05) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(51, 51, 51, 0.05) 75%)
        `,
        'pattern-grid': `
          linear-gradient(to right, rgba(189, 182, 182, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(138, 131, 131, 0.1) 1px, transparent 1px)
        `,
        'pattern-dots': 'radial-gradient(#333 1px, transparent 2px)',
        'pattern-waves': `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(51, 51, 51, 0.1) 20px,
            rgba(51, 51, 51, 0.1) 40px
          )
        `,
      },
      animation: {
        'pattern-move': 'patternMove 20s linear infinite',
        'gradient-bg': 'gradientBG 15s ease infinite',
      },
      keyframes: {
        patternMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100px 100px' },
        },
        gradientBG: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        'pattern-grid': '20px 20px',
        'pattern-dots': '30px 30px',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.brutalist-card': {
          border: '3px solid var(--primary)',
          boxShadow: '8px 8px 0 var(--primary)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translate(-4px, -4px)',
            boxShadow: '12px 12px 0 var(--primary)',
          },
        },
        '.brutalist-button': {
          border: '2px solid var(--primary)',
          background: 'var(--secondary)',
          boxShadow: '4px 4px 0 var(--primary)',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          position: 'relative',
          isolation: 'isolate',
          color: 'white',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 var(--primary)',
            background: 'var(--accent)',
            color: 'var(--primary)',
          },
          '&:active': {
            transform: 'translate(0, 0)',
            boxShadow: '2px 2px 0 var(--dark-gray)',
          },
        },
        '.dashboard-card': {
          border: '3px solid var(--dashboard-primary)',
          boxShadow: '8px 8px 0 var(--dashboard-secondary)',
          transition: 'all 0.2s ease',
          background: 'var(--dashboard-light)',
          position: 'relative',
          zIndex: '1',
          '&:hover': {
            transform: 'translate(-4px, -4px)',
            boxShadow: '12px 12px 0 var(--dashboard-secondary)',
          },
        },
        '.dashboard-button': {
          border: '2px solid var(--dashboard-primary)',
          background: 'var(--dashboard-secondary)',
          boxShadow: '4px 4px 0 var(--dashboard-primary)',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          position: 'relative',
          isolation: 'isolate',
          color: 'var(--dashboard-light)',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 var(--dashboard-primary)',
            background: 'var(--dashboard-accent)',
          },
        },
      });
    },
  ],
};

