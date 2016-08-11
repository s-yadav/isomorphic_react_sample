
import React from 'react'

class ColorBar extends React.Component {
  render() {
    const {color, value} = this.props;
    return (
      <div className="color-bar">
        <div style={{
          backgroundColor: color,
          width: (value*100/150) + '%'
        }} className="color-fill"></div>
      </div>
    )
  }
}

ColorBar.propTypes = {
  value: React.PropTypes.number.isRequired
}

ColorBar.defaultProps = {
  color: '#f44336'
}

export default ColorBar;
