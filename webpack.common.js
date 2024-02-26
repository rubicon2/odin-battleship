const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(otf|ttf|woff|woff2)/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin('New Webpack Project')],
};
