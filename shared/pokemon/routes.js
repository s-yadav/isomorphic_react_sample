//shim require so it can be used in isomorphic application
require('../util/patch_require')(require);

const pokeRoutes = [{
  path: '/',
  getComponents(nextState, cb) {
    require.ensure(['./pokemon_list'], (require) => {
      cb(null, require('./pokemon_list'));
    });
  }
}, {
  path: 'pokemon',
  redirect: '/'
}, {
  path: 'pokemon/:pokemonId',
  getComponents(nextState, cb) {
    require.ensure(['./pokemon_detail'], (require) => {
      cb(null, require('./pokemon_detail'));
    });
  }
}];

module.exports = pokeRoutes;
