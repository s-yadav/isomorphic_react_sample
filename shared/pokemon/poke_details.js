const React = require('react'),
  classNames = require('classnames'),
  {COLORS} = require('../config.js'),
  Statistic = require('./statistic.js');

class PokeDetails extends React.Component {
  render() {
    const {pokemon, onClose, open} = this.props;
    if (!pokemon) return null;

    const type = pokemon.types.filter(type => type.slot === 1)[0].type.name;
    return (
      <div className={classNames("pokemon-details-wrapper", {'show': open})}>
        <div className="overlay"></div>

        <div className={classNames("pokemon-details", {'show': open})}>

          {/*<h3 className="details-header" style={{backgroundColor: COLORS[type]}}>
            <label className="pokemon-name">{pokemon.name}</label>
            <button onClick={onClose} className="close-button"><span className="cross">✕</span></button>
          </h3>*/}

          <div className="pokemon-details-container">

            <div className="pokemon-important-info">
              <div className="poke-img" style={{backgroundImage: 'url("'+'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'+'")'}} ></div>

              <div className="stats">
                <ul className="types">
                  {
                    pokemon.types.map(typeObj => <li className="type" key={typeObj.slot} style={{backgroundColor: COLORS[typeObj.type.name]}}>{typeObj.type.name}</li>)
                  }
                </ul>
                <label className="poke-id">#{pokemon.id}</label>
                <ul className="stats-group">
                  {
                    pokemon.stats.map((statObj, key) => <Statistic value={statObj.base_stat} color={COLORS[type]} title={statObj.stat.name} key={key}/>)
                  }
                </ul>
              </div>
            </div>

            <div className="attributes">
              <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>physical attributes</h3>
              <dl className="detial-group">
                <dt>Height</dt>
                <dd>{pokemon.height/10} m</dd>
              </dl>
              <dl className="detial-group">
                <dt>Weight</dt>
                <dd>{pokemon.weight/10} kg</dd>
              </dl>
              <dl className="detial-group">
                <dt>experience</dt>
                <dd>{pokemon.base_experience} XP</dd>
              </dl>
            </div>

            <div className="moves-container">
              <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>abilities</h3>
              <ul className="moves">
                {
                  pokemon.abilities.map((abilityObj, key) => <li className="move" key={key} style={{borderColor: COLORS[type]}}>{abilityObj.ability.name}</li>)
                }
              </ul>
            </div>

            <div className="moves-container">
              <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>Moves</h3>
              <ul className="moves">
                {
                  pokemon.moves.map((moveObj, key) => <li className="move" key={key} style={{borderColor: COLORS[type]}}>{moveObj.move.name}</li>)
                }
              </ul>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

module.exports = PokeDetails;
