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
    historyApiFallback: true,
    proxy: {
      "/graphql": {
        target: "http://localhost:4000/graphql",
      },
    },
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "http://localhost:3000",
    }),
  ],
});
