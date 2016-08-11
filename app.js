'use strict';
require("babel-register");

// Require hook to ignore less includes
function ignoreRequire(extension) {
  require.extensions[extension] = function(m, filename) {
    console.log(filename);
    return;
  };
}

// ignore less requires
ignoreRequire('.less');

//monkey patch require method to ignore code splits
// const _require = require;
//
// require = function(){
//   console.log(Array.isArray(arguments[0]));
//   if(Array.isArray(arguments[0])) return;
//   return _require.apply(this, Array.prototype.slice.call(arguments));
// }

console.log(require.ensure);

const server = require("./server.js");

server();
