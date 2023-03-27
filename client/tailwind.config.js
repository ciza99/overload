const { colors } = require("./src/constants/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        "poppins-light": ["Poppins_300Light"],
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semi-bold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
        "poppins-extra-bold": ["Poppins_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
