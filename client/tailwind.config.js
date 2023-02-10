const { colors } = require("./src/constants/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        poppinsLight: ["Poppins_300Light"],
        poppinsRegular: ["Poppins_400Regular"],
        poppinsMedium: ["Poppins_500Medium"],
        poppinsSemiBold: ["Poppins_600SemiBold"],
        poppinsBold: ["Poppins_700Bold"],
        poppinsExtraBold: ["Poppins_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
