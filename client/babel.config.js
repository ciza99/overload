module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@components": "./src/components",
            "@constants": "./src/constants",
            "@hooks": "./src/hooks",
            "@pages": "./src/pages",
            "@models": "./src/models",
            "@types": "./src/types",
            "@api": "./src/api",
            "@utils": "./src/utils",
            "@schemas": "./src/schemas",
            "@src": "./src",
          },
        },
      ],
    ],
  };
};
