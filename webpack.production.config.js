const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');


module.exports = {
  entry: {
    app : [
      './client/client'
    ]
  },
  output: {
    path: path.join(__dirname, "public","js"),
    filename: '[name]-[chunkhash].js',
    chunkFilename : '[name]-[chunkhash].js',
    publicPath : '/public/js/'
  },
  resolveLoader: {
    modulesDirectories: ['','node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      // This has effect on the react lib size.
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
//    new webpack.optimize.DedupePlugin(), //this is buggy, need to test properly so comment it for now
    new webpack.optimize.CommonsChunkPlugin({
      name : 'common',
      filename : 'commons-[chunkhash].js',
      minSize : Infinity
    }),
    //new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[chunkhash].css",{
      allChunks : true
    }),
    new ManifestPlugin({
      fileName: path.join('..','..','webpack-manifest','manifest.json'),
    }),
    new ChunkManifestPlugin({
      filename: path.join('..','..','webpack-manifest','chunk-manifest.json'),
      manifestVariable: 'webpackManifest'
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  externals: {
    'braintree': 'braintree',
    
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
