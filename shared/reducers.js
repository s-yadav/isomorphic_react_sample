const { combineReducers } = require('redux');
const {pokemons} = require('./pokemon/pokemon_reducer');


const rootReducers = combineReducers({
  pokemons
});

module.exports = rootReducers;
