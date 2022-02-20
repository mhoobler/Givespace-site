const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.join(__dirname, "client"),
  entry: {
    index: ["./src/index.tsx"],
    list: ["./src/entry-points/list.tsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist", "build"),
    filename: "[name].js",
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, "client/src/components"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },
  devServer: {
    static: "./client",
    port: 3000,
    compress: true,
    historyApiFallback: true,
    open: ["http://localhost:4000"],
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "client", "src"),
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.less$/i,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "client", "src"),
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: [path.resolve(__dirname, "client/src/theme.less")],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jped|gif)$/i,
        include: path.resolve(__dirname, "client", "src"),
        type: "asset/resource",
      },
    ],
  },
};
