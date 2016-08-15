const React = require('react'),
  classNames = require('classnames'),
  {connect} = require('react-redux');

const {Link} = require('react-router');
const PokemonDetail = require('./poke_details');

require("./poke_details.less");

let PokemonDetailContainer = React.createClass({
  componentDidMount(){
    require(['./module2'],function(){
      console.log('module 2 loaded');
    });
  },
  render(){

    const {params,pokemons} = this.props;

    const pokemon = pokemons[params.pokemonId]
    return (<div className="container">
      <header className="header">
        <div className="wrapper">
          <Link to={"/pokemon/"}><img className="logo" src="/public/images/logo.png" /></Link>
          <div className="name">{pokemon.name}</div>
        </div>
      </header>
      <div className="wrapper">
        <div className="poke-detail">
          <PokemonDetail pokemon={pokemon} open={true}/>
        </div>
      </div>
    </div>);
  }
})

PokemonDetailContainer = connect((state) => {
  return {pokemons: state.app.pokemons.pokemon}
}, (dispatch) => {
  return {
    //routeActions: bindActionCreators(routeActions, dispatch)
  }
})(PokemonDetailContainer);

module.exports = PokemonDetailContainer;
