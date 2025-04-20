module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./app"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@components": "./app/components",
            "@screens": "./app/screens",
            "@navigation": "./app/navigation",
            "@context": "./app/context",
            "@types": "./app/types",
            "@data": "./app/data",
          },
        },
      ],
    ],
  };
};
