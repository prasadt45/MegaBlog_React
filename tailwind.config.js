// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        typing: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        typing: 'typing 3s steps(30, end) forwards',
        blink: 'blink 0.7s step-end infinite',
      },
    },
  },
  plugins: [],
};
