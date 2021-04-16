const resolve = require("path").resolve;
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",
  entry: {
    "react.d3.calendar.heatmap": "./demo/index.tsx"
  },
  output: {
    filename: "static/js/[name].[fullhash].js",
    path: resolve(__dirname, "../", "build"),
    pathinfo: true,
    publicPath: "./"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  stats: "verbose",
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, "../", "public"), 
    publicPath: "/",
    host: host,
    https: protocol === "https",
    port: DEFAULT_PORT,
    disableHostCheck: true,
    historyApiFallback: true,
    stats: {
      colors: true, 
      chunks: false, 
      "errors-only": true
    }
  },
  optimization: {
    moduleIds: "named"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./demo/index.html",
      filename: "./index.html",
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.tsx?$/,
        use: "source-map-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.ts(x?)$/,
        use: [{ loader: "ts-loader" }],
        include: resolve(__dirname, "../"),
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        exclude: [/node_modules/],
        include: resolve(__dirname, "../"),
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
          }
        ]
      }
    ]
  }
};
