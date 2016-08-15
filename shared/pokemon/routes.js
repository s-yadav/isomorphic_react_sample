const React = require('react');
const AssetLoaderWrapper = require('../util/asset_load_wrapper');

//shim require so it can be used in isomorphic application
if (typeof(require.ensure) !== "function") {
  require.ensure = function(modules, callback) {
    callback(require);
  }
}

const pokeRoutes = [{
  path: '/',
  getComponents(nextState, cb) {
    console.log('coming here');
    require.ensure(['./pokemon_list'], (require) => {
      const PokemonList = require('./pokemon_list');
      const assets = {
        js : ['pokemon-list.js'],
        css : ['pokemon.css']
      };
      console.log('log details');
      cb(null, AssetLoaderWrapper(assets, PokemonList));
    },'pokemon-list');
  }
}, {
  path: 'pokemon',
  redirect: '/'
}, {
  path: 'pokemon/:pokemonId',
  getComponents(nextState, cb) {
    require.ensure(['./pokemon_detail'], (require) => {
      const PokemonDetail = require('./pokemon_detail');
      const assets = {
        js : ['pokemon-list.js'],
        css : ['pokemon.css']
      };
      cb(null, AssetLoaderWrapper(assets, PokemonDetail));
    },'pokemon-list');
  }
}];

module.exports = pokeRoutes;
