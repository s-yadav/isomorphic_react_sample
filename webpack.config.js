const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    app : [
      "webpack-dev-server/client?http://localhost:8081",
      'webpack/hot/only-dev-server',
      './client/client'
    ]
  },
  devtool: "eval",
  debug: true,
  output: {
    publicPath: "http://localhost:8081/public/js/",
    path: path.join(__dirname, "public"),
    filename: '[name].bundle.js'
  },
  resolveLoader: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin("base.bundle.js")
  ],
  externals: {
    'braintree': 'braintree'
  },
  resolve: {
    extensions: ['','.js'] //can add jsx also but not required
  },
  postcss: function () {
      return [autoprefixer];
  },
  module: {
    loaders: [
      // { test: /\.css$/, loaders: ['style', 'css']},
      // { test: /\.cjsx$/, loaders: ['react-hot', 'coffee', 'cjsx']},
      // { test: /\.coffee$/, loader: 'coffee' }
      {test: /\.js$/, loaders:['react-hot', 'babel'], exclude: /node_modules/},
      {
        test: /\.less|.css$/,
        loader: "style!raw!postcss!less"
      },
    ]
  }
};
