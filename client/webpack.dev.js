const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    port: 3000,
    compress: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        pathRewrite: { "^/api": "" },
      },
    },
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "http://localhost:3000",
    }),
  ],
});
