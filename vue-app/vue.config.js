const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      library: "[name]",
      libraryTarget: "umd",
    },
  },
});
