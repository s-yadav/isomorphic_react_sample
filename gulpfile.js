'use strict';
require("babel-register");

// Include Gulp & tools we'll use
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");
const $ = require('gulp-load-plugins')();
const path = require('path');
const map = require('map-stream');

const webpackConfig = require("./webpack.config.js");
const webpackProductionConfig = require("./webpack.production.config.js");

const server = require('./server');


const sockjs = require('sockjs');
const http = require('http');

const echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js',  });

let echoConnection;
echo.on('connection', function(conn) {
    echoConnection = conn;
    conn.on('data', function(message) {
        conn.write(message);
    });
    conn.on('close', function() {});
});


const ASSETS = "./public";
let devServer = {};

/*** less file configuration ***/
const lessConfigs = [{
  src: "./styles/index.less",
  dest: "index.css"
}, {
  src: "./styles/base.less",
  dest: "base.css"
}];

//compile less script
(function () {
  //create a list of task with configuration
  const taskList = [];

  lessConfigs.forEach(function(obj) {
    gulp.task('less-' + obj.dest, function() {
      return gulp.src(obj.src)
        .pipe($.less({
          paths: [path.join(__dirname, 'app', 'less')]
        })).on('error', function(err) {
          this.emit('end');
          return gutil.log(err);
        })
        .pipe($.size())
        .pipe($.concat(obj.dest))
        .pipe(gulp.dest(ASSETS + '/css/'))
        .pipe(map(function(a, cb) {
          if(echoConnection) echoConnection.write('reload-css');
          return cb();
        }));
    });

    taskList.push('less-' + obj.dest);
  });

  gulp.task('less', taskList);

  gulp.watch(['./styles/**/*', './shared/**/*.less'], ['less']);

}());


// Optimize images and copy to destination folder
(function () {
  gulp.task('images', function() {
    return gulp.src(ASSETS + '/raw_images/**/*')
      .pipe($.changed(ASSETS + '/images'))
      .pipe($.imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest(ASSETS + '/images'))
      .pipe($.size({
        title: 'images'
      }))
      .pipe(map(function(a, cb) {
        if(echoConnection) echoConnection.write('reload-image');
        return cb();
      }));
  });
  gulp.watch(ASSETS + '/raw_images/**/*', ['images']);
}());



gulp.task("webpack:build", function(callback) {
  return webpack(webpackProductionConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack:build", err);
    }
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});


const devCompiler = webpack(webpackConfig);

gulp.task("webpack:build-dev", function(callback) {
  devCompiler.run(function(err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack:build-dev", err);
    }
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    callback();
  });
});


gulp.task("webpack-dev-server", ['images'], function(callback) {
  // touch.sync('./public/main.css', {
  //   time: new Date(0)
  // });
  devServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: 'http://localhost:8081',
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    //  lazy : false,
    publicPath: webpackConfig.output.publicPath,
    // watchOptions: {
    //   aggregateTimeout: 100,
    //   poll: 300
    // },
    noInfo: true
  });

  //start a webSocket server
  const socketServer = http.createServer();
  echo.installHandlers(socketServer, {prefix:'/socket_channel'});
  socketServer.listen(8082, '0.0.0.0');

  devServer.listen(8081, function(err) {
    if (err) {
      throw new gutil.PluginError("webpack-dev-server", err);
    }
    gutil.log("[webpack-dev-server]", "http://localhost:8081");
    return callback();
  });

  //server(true);

  $.nodemon({
    script: 'app.js'
  , env: { 'NODE_ENV': 'development' }
});

//  gulp.watch('./shared/**/*.js', ['webpack:build-dev']);
//  devServer.listen(8080, "0.0.0.0");
});

gulp.task('default', function() {
  return gulp.start('run');
});

gulp.task('build', ['images','webpack:build'],function(){
  process.exit();
});

gulp.task('run', ["webpack-dev-server"]);

module.exports = gulp;
