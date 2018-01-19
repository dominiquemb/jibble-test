module.exports = {
  entry: "./app.js",
  output: {
    filename: "bundle.js"
  },
  devServer: { 
    host: "0.0.0.0",
    port: "8888",
    disableHostCheck: true
  }
}
