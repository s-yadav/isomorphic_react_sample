const React = require('react');
const loadRouteData = require('./load_page_state').load;
const {routeActions} = require('react-router-redux');
const {connect} = require('react-redux');
const {bindActionCreators} = require('redux');
const classNames = require('classnames');
const $ = require('jquery');

const pageLoader = {
  add : function(){
    if(this.loader) return;
    clearInterval(this.interval);
    $('body').prepend('<div class="page-loader"></div>');
    this.loader = $('.page-loader');
    let perc = 0;
    this.interval = setInterval(()=>{
      if(!this.loader) clearInterval(this.interval);
      if(perc < 90){
        perc += Math.ceil(Math.random()*10);
        this.loader.css({width : perc+'%'});
      }
    },40);
  },
  remove : function(){
    clearInterval(this.interval);
    if(!this.loader) return;
    this.loader.css({width : 100+'%'});
    setTimeout(()=>{
      if(!this.loader) return;
      this.loader.remove();
      this.loader = null;
    },100);
  }
}

const actions = {
  push : function(url,state, sessionData, loadingState){
    return function(dispatch){
      bindActionCreators(routeActions,dispatch).push(url);
    }
    // if(typeof loadingState === undefined) loadingState = true;
    //
    // pageLoader.add();
    //
    // return function(dispatch){
    //   return loadRouteData(url,state,dispatch,sessionData).then(()=>{
    //     bindActionCreators(routeActions,dispatch).push(url);
    //     pageLoader.remove();
    //   },()=>{
    //     pageLoader.remove();
    //   });
    // }
  }
}


let Link = React.createClass({
  getInitialState : function(){
    return {};
  },
  handleEventClick : function(e){
    const {to,state,sessionData,loadingState} = this.props;
    if(!(e.nativeEvent.which === 2 || e.ctrlKey || e.metaKey)){
        e.preventDefault();
        this.props.routeActions.push(this.props.to, this.props.state, sessionData, loadingState);
    }
    this.props.onClick && this.props.onClick(e);
  },
  updateActiveState : function(){
    const path = document.location.pathname;
    if(this.state.lastPath === path) return;

    this.setState({
      lastPath : path,
      active : this.props.to !== "/" ? path.indexOf(this.props.to) === 0 : this.props.to === path
    });
  },
  componentDidMount : function(){
    this.updateActiveState();
  },
  componentDidUpdate : function(){
    this.updateActiveState();
  },

  render : function(){
    return (
      <a {...this.props} href={this.props.to} className={classNames(this.props.className, {active : this.state.active})} onClick={this.handleEventClick}>
        {this.props.children}
      </a>
    )
  }
});

Link = connect((state) => {
  return {}
}, (dispatch) => {
  return {routeActions: bindActionCreators(routeActions, dispatch)}
})(Link);

module.exports = {
  routeActions : actions,
  Link,
  pageLoader
}
