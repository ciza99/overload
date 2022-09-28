module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components",
            context: "./src/context",
            constants: "./src/constants",
            hooks: "./src/hooks",
            modules: "./src/modules",
            models: "./src/models",
            types: "./src/types",
            api: "./src/api",
            utils: "./src/utils",
            src: "./src",
          },
        },
      ],
    ],
  };
};
