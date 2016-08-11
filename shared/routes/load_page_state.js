const pokemonActions = require('../pokemon/pokemon_actions');
const {CONSTANTS} = require('../config');
const UrlPattern = require('url-pattern');
const {bindActionCreators} = require('redux');

const urlPatternOption = {segmentValueCharset : 'a-zA-Z0-9-_~ %.@'};
function loadPageState(url, state , dispatch, sessionData = {}){

  return $def((resolve, reject) => {

    let pattern, routeData;
    const token = sessionData.token;

    /** page specific data loading **/
    routeData = new UrlPattern('/',urlPatternOption).match(url) || new UrlPattern('/pokemon',urlPatternOption).match(url) || new UrlPattern('/pokemon/',urlPatternOption).match(url);
    if(routeData){
      console.log(routeData);
      const pageState = state && state.pokemons.list.length;
      if(pageState){
        resolve();
        return;
      }
      bindActionCreators(pokemonActions,dispatch).loadPokemonList().then(resolve, reject);
      return;
    }

    //if loading pokemon detail page
    pattern = new UrlPattern('/pokemon/:pokemonId(*)',urlPatternOption);
    routeData = pattern.match(url);

    if(routeData){
      const pokemonId = routeData.pokemonId;
      const pageState = state && state.pokemons.pokemon[pokemonId];
      if(pageState && pageState.abilities){
          resolve();
      }
      bindActionCreators(pokemonActions,dispatch).loadPokemonDetail(pokemonId).then(resolve,reject);
      return;
    }

    resolve();
  });

}

module.exports ={
  load : loadPageState
};
