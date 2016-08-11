const React = require('react');
const ReactDOM = require('react-dom');
const twemoji = require('twemoji');

const encodeEmoji = function(str, removeEmojis = false){
  if (!str) return str;
  str = unescape(escape(str).replace(/%u/g,'\\u'));
  if(removeEmojis) {
    //replace emojis
    str = str.replace(/\\u([\d\w]{4})/gi, function (match, grp) {
      return removeEmojis ? '' : String.fromCharCode(parseInt(grp, 16));
    });
  };
  return str;
}

const decodeEmoji = function(str, removeEmojis = false){
  if (!str) return str;
  //replace emojis
  str = str.replace(/\\u([\d\w]{4})/gi, function (match, grp) {
    return removeEmojis ? '' : String.fromCharCode(parseInt(grp, 16));
  });

  //replace other hexa sequence
  str = str.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
      return String.fromCharCode(parseInt(arguments[1], 16));
  });

  //replace octal sequence
  str = str.replace(/\\([\d]{3})/gi, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 8));
  });

  return str;
}

const Emoji = React.createClass({
  parse(){
    const node = ReactDOM.findDOMNode(this);
    twemoji.parse(node, {
      folder: 'svg',
      ext: '.svg'
    });
  },
  componentDidUpdate() {
    this.parse();
  },
  componentDidMount() {
    this.parse();
  },
  render() {
    const { children } = this.props;
    return <span {...this.props}>{typeof children === "string" ? decodeEmoji(children) : children}</span>;
  }
});

module.exports = {
  Emoji,
  encodeEmoji,
  decodeEmoji
};
