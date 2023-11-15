module.exports = {
  "**/*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,

  "**/*.(ts|tsx)": () => "npx tsc -b",

  "**/*.(ts|tsx|js)": (filenames) => [
    `npx eslint --fix ${filenames.join(" ")}`,
    `npx prettier --write --plugin @ianvs/prettier-plugin-sort-imports --plugin prettier-plugin-tailwindcss ${filenames.join(
      " "
    )}`,
  ],
};
