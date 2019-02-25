/*** webpack.config.js ***/
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
 template: path.join(__dirname, "examples/src/index.html"),
 filename: "./index.html"
});
module.exports = {
 entry: path.join(__dirname, "examples/src/index.js"),
 module: {
   rules: [{
     test: /\.(js|jsx)$/,
   use: "babel-loader",
   exclude: /node_modules/
 },{
   test: /\.css$/,
   use: ["style-loader", "css-loader"]
 },{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
            bypassOnDebug: true, // webpack@1.x
            disable: true, // webpack@2.x and newer
            },
          },
          {
          loader: 'url-loader',
          options: {
              limit: 500,//当图片小于这个值他会生成一个图片的url 如果是一个大于的他会生成一个base64的图片在js里展示
              outputPath: 'dist/',// 指定打包后的图片位置
              name: '[name].[ext]?[hash]',//name:'[path][name].[ext]
          }
      }
  ],
}
]
},
 plugins: [htmlWebpackPlugin],
 resolve: {
   extensions: [".js", ".jsx"]
 },
 devServer: {
   port: 3001
}};
