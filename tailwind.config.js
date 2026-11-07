const { colors } = require('./src/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors, // O Tailwind agora puxa as cores do colors.ts
    },
  },
  plugins: [],
};
