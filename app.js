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

const server = require("./server.js");

server();
