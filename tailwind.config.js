module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff99',
          pink: '#ff00cc',
          cyan: '#00fff3'
        },
        retroYellow: '#FFEA00'
      },
      animation: {
        pulseFast: 'pulse 1s infinite'
      }
    }
  },
  plugins: []
}