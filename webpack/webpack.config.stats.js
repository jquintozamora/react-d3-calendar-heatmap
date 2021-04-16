const Visualizer = require("webpack-visualizer-plugin2");
const currentDateTime = new Date();
const currentDate = currentDateTime
  .toLocaleDateString("en-GB")
  .replace(/\//g, "-");
const currentTime = currentDateTime
  .toLocaleTimeString("en-GB", { hour12: false })
  .replace(/:/g, "-");
const fileDateTime = currentDate + "-" + currentTime;
const statisticsFileName =
  "../webpack/stats/statistics-" + fileDateTime + ".html";
const prodConfig = require("./webpack.config.prod.js");
prodConfig.plugins = prodConfig.plugins.concat(
  new Visualizer({
    filename: statisticsFileName,
  })
);
module.exports = prodConfig;
