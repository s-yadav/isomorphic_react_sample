const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const PageMetaData = React.createClass({
  update(){
    const temp = document.createElement("div");
    ReactDOM.render(<div className="page-meta-to-be-moved">{this.props.children}</div>, temp);
    const $temp = $(temp);
    $('head title').remove();
    $('head').append($temp.find('title'));
  },
  componentDidUpdate(prevProps) {
    if(prevProps.children === this.props.children) return;
    this.update();
  },
  componentDidMount() {
    this.update();
  },
  render() {
    return typeof window !== 'undefined' ? null : (<div className="page-meta-to-be-moved">{this.props.children}</div>);
  }
});

module.exports = PageMetaData;
