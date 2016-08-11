import React from 'react'
import ColorBar from './color_bar.js'

class Statistic extends React.Component {
  render() {
    const {color, value, title} = this.props;
    return (
      <li className="statistic">
        <label className="title">{title}</label>
        <ColorBar value={value} color={color} />
        <span className="value">{value}</span>
      </li>
    )
  }
}

Statistic.propTypes = {
  title: React.PropTypes.string.isRequired
}
module.exports = Statistic;
