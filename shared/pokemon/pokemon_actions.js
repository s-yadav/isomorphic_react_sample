const $ = require('jquery');
const $def = require('../util/deferred');
const ls = require('../util/localstorage');
const ACTION = require('../action_constant');

const {
    ajaxGet
} = require('../util/ajax');
const {
    API
} = require('../config');


const authAction = {
    loadPokemonList: function() {
        return (dispatch) => {
            return ajaxGet({
                url: API.getPokemons + '/?limit=200&offset=0',
                success: function(pokemons) {
                    pokemons = pokemons.results.map(function(pokemon) {
                        var url = pokemon.url;
                        var match = /http:\/\/pokeapi.co\/api\/v2\/pokemon\/([0-9]{0,})+\//gi.exec(url);
                        var id = match[1];
                        return {
                            id: id,
                            url: url,
                            name: pokemon.name,
                            image: 'http://pokeapi.co/media/sprites/pokemon/' + id + '.png'
                        }
                    });

                    dispatch({
                        type: ACTION.POKEMON.LOAD_LIST,
                        data: pokemons
                    });
                }
            });
        }
    },
    loadPokemonDetail: function(pokemonId) {
        return (dispatch) => {
            return ajaxGet({
                url: API.getPokemonDetail + '/' + pokemonId+ '/',
                success: function(pokemonDetail) {
                      dispatch({
                        type: ACTION.POKEMON.ADD_DETAILS,
                        data: pokemonDetail,
                        pokemonId
                    });
                }
            });
        }
    }
}


module.exports = authAction;
