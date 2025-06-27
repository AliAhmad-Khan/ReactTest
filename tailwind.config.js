module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        primary: {
          main: '#0096D6',
        },
        secondary: {
          main: '#00B2A9',
        },
        tertiary: {
          main: '#6C63FF',
        },
        quaternary: {
          main: '#FF3B30',
        },
        success: {
          main: '#22C55E',
        },
        error: {
          main: '#FF3B30',
        },
        warning: {
          main: '#FF9800',
        },
        info: {
          main: '#1976D2',
        },
        disabled: {
          main: '#E0E0E0',
        },
      },
    },
  },
  plugins: [],
}
