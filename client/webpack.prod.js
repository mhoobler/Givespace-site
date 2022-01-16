const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "",
    }),
  ],
});
