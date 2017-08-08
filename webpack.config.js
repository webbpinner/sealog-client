var CopyWebpackPlugin = require ("copy-webpack-plugin");
var path = require("path");

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
//    path: __dirname,
    path: path.resolve(__dirname, "dist"),
    publicPath: '/sealog/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    port: 9000,
  },
  plugins: [
    new CopyWebpackPlugin([
        {context: 'node_modules/react-bootstrap-theme-switcher/themes/', from: '**/*', to: 'themes/'}
      ],
      {copyUnmodified: true}
    )
  ]
};
