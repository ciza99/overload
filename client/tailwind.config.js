/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#429A95",
        secondary: "#429A95",
        text: "white",
        background: "#191A1C",
        paper: "#121212",
        divider: "rgba(255, 255, 255, 0.5)",
        muted: "rgba(255, 255, 255, 0.5)",
        danger: "#d13f34",
      },
      fontFamily: {
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
        "poppins-bold": ["Poppins_700Bold"],
      },
    },
  },
  plugins: [],
};
