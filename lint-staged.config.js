module.exports = {
  "**/*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,
};
