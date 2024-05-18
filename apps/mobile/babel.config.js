module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "babel-preset-expo",
      "@babel/preset-typescript",
    ],
    plugins: [
      // Ensure 'react-native-reanimated/plugin' is last
      "react-native-reanimated/plugin",
    ],
  };
};
