module.exports = function(newRequire) {
  if (typeof(newRequire.ensure) !== "function") {
    newRequire.ensure = function(modules, callback) {
      callback(newRequire);
    }
  }
}
