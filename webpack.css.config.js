const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');


module.exports = {
  entry: {
    app : [
      './client/client'
    ],
    pokemon : ['./shared/pokemon/routes']
  },
  output: {
    path: path.join(__dirname, "public","css"),
    publicPath : '/public/css/',
    libraryTarget: "var",
  },
  resolveLoader: {
    modulesDirectories: ['','node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      // This has effect on the react lib size.
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(), //this is buggy, need to test properly so comment it for now
    new ExtractTextPlugin("[name]-[chunkhash].css",{
      allChunks : true
    }),
    //new webpack.optimize.UglifyJsPlugin(),
    new ManifestPlugin({
      fileName: path.join('..','..','webpack-manifest','css-manifest.json'),
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  externals: {
    'jquery' : 'jQuery',
    "react" : "React",
    "react-router" : "ReactRouter",
    "react-dom" : "ReactDOM"
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
      {test: /\.js$/, loader:'babel', exclude: /node_modules/},
      {
        test: /\.less|.css$/,
        loader: ExtractTextPlugin.extract('style', 'raw!postcss!less')
      }
    ]
  }
};
