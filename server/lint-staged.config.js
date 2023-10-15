export default {
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",

  "**/*.(ts|tsx|js)": (filenames) => [
    `npx eslint --fix ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],
};
