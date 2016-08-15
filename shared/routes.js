const {Router, Route, IndexRoute, IndexRedirect } = require('react-router'), {Provider} = require('react-redux'),
  React = require('react'),
  App = require('./index'),
  PokeRoutes = require('./pokemon/routes');

//require('./util/patch_require')(require);

const AppRoute = {
  component : App,
  childRoutes : PokeRoutes,
}


module.exports = AppRoute;
