const React = require('react'),
  classNames = require('classnames');

const {connect} = require('react-redux');
const {Link} = require('react-router');


const Pokemon = React.createClass({
  render(){
    const {name, image, id, loading, onClick} = this.props;
    return (
        <div className={classNames({loading : loading}, "pokemon")}>
          <Link to={"/pokemon/"+id} onClick={onClick}>
            <div className="poke-img" style={{backgroundImage: 'url("'+image+'")'}}></div>
            <label className="poke-name">{name}</label>
          </Link>
          </div>

    )
  }
});

let PokemonList = React.createClass({
  getInitialState(){
    return {}
  },
  componentDidMount(){
    require(['./module1'],function(){
      console.log('module 1 loaded');
    });
  },
  render(){
    const {pokemonList,pokemons} = this.props;
    return (<div className="container">
      <header className="header">
        <div className="wrapper">
          <img className="logo" src="/public/images/logo.png" />
        </div>
      </header>
      <div className="wrapper">
        <div className="poke-list">
          {
            pokemonList.map((pokeId, idx)=>{
              const pokemon = pokemons[pokeId];
                return <Pokemon key={idx} {...pokemon} loading={this.state.loadingPokemon === pokemon} onClick={()=>{this.setState({loadingPokemon : pokemon})}}/>
            })
          }
        </div>
      </div>
    </div>);
  }
})

PokemonList = connect((state) => {
  return {pokemonList: state.app.pokemons.list, pokemons : state.app.pokemons.pokemon}
}, (dispatch) => {
  return {
    //routeActions: bindActionCreators(routeActions, dispatch)
  }
})(PokemonList);

module.exports = PokemonList;
