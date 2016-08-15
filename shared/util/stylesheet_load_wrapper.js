const React = require('react');
const $def = require('mini-deferred');

const isServer = typeof window === 'undefined';
const JS_HOST_PATH = "/public/js/";
const CSS_HOST_PATH = "/public/css/"

let webpackManifest;
try {
  webpackManifest = require('../../webpack-manifest/manifest.json');
}
catch(e){
  if(typeof window !== 'undefined') webpackManifest = window.webpackManifest;
}

function checkIfCSSAlreadyPresent(link){
  return !!document.querySelector('link[href="'+link+'"]');
}

function addStylesheetToDom(links){
  const docFragment = document.createDocumentFragment();
  const promises = [];
  links.forEach((url)=>{
      if(checkIfCSSAlreadyPresent(url)) return;

  //  promises.push($def(function(resolve, reject){
      const link = document.createElement('link')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', url);
      docFragment.appendChild(link);

  //  }));
  });
  document.getElementsByTagName('head')[0].appendChild(docFragment);
}

const StylesheetLoadWrapper = React.createClass({
  render(){
    const {props} = this;
    let cssLinks = null;
    if(webpackManifest){

      //add css assets
      if (props.css) {
        if (isServer) {
          console.log('has css');
          cssLinks = props.css.map((css, idx) => {
            return (<link key={idx} rel="stylesheet" href={CSS_HOST_PATH+webpackManifest[css]} data-asset="stylesheet" />);
          });
        }
        else {
          addStylesheetToDom(props.css.map((css, idx) => {
            return (CSS_HOST_PATH+webpackManifest[css]);
          }));
        }
      }
    }

    return (<div className="component-wrapper">
      {cssLinks}
      {this.props.children}
    </div>);
  }
})

module.exports = function(assets,Component){
  return React.createClass({
    render(){
      return (<StylesheetLoadWrapper css={assets.css}>
        <Component {...this.props}/>
      </StylesheetLoadWrapper>);
    }
  })
}
