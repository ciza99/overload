// eslint-disable-next-line no-undef
module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(react-native/(.*)$)|^(react-native$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@features/core/(.*)$",
    "^@features/api/(.*)$",
    "^@features/ui/(.*)$",
    "^@features/(.*)$",
    "",
    "^[./]"
  ]
}
