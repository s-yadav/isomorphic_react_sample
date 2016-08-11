const { combineReducers } = require('redux');
const ACTION = require('../action_constant');

function pokemon(state={}, action){
  switch (action.type) {
    case ACTION.POKEMON.ADD_DETAILS:{
      return Object.assign({},state,action.data);
    }
    default:
      return state;
  }
}

function pokemons(state={
  pokemon : {},
  list : []
}, action){
  switch (action.type) {
    case ACTION.POKEMON.LOAD_LIST:{
      const idList = [], pokemons = action.data;
      pokemons.forEach((poke)=>{
        const id = poke.id;
        idList.push(id);
        state.pokemon[id] = pokemon(state.pokemon[id], {
          type : ACTION.POKEMON.ADD_DETAILS,
          data : poke
        });
      });
      return Object.assign({},state,{list : idList});
    }
    case ACTION.POKEMON.ADD_DETAILS:{
      return Object.assign({},state,{
        pokemon : Object.assign({},state.pokemon,{
          [action.pokemonId] : pokemon(state.pokemon[action.pokemonId],action)
        })
      });
    }
    default:
      return state;
  }
}

module.exports = {pokemons};
