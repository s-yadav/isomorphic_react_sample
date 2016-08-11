require('../styles/base.less');
require('../styles/index.less');

const  React =  require('react'),
    {Link} = require('react-router');
const { connect } =  require('react-redux');
const {isRedirectionRequired} = require('./redirects');
const {pageLoader} = require('./routes/route_util');

const loadRouteData = require('./routes/load_page_state').load;

let App =  React.createClass({
  getInitialState() {
    return {
    };
  },
  componentWillReceiveProps(nextProps) {
    const {props} = this;

    //check if redirection required
    const newLocation = nextProps.state.routing.location;
    const oldLocation = props.state.routing.location;
    const newPath = newLocation.pathname + newLocation.search;
    const oldPath = oldLocation.pathname + oldLocation.search;

    if(newLocation.pathname != oldLocation.pathname){

      const redirectTo = isRedirectionRequired(nextProps.state);
      if(redirectTo) this.props.history.replace(redirectTo);

      this.loadingData = true;
      pageLoader.add();

      return loadRouteData(newPath, nextProps.state.app, nextProps.dispatch, {}/*session information*/).then(()=>{
          this.loadingData = false;
          this.forceUpdate();
          pageLoader.remove();
          setTimeout(() => window.scroll(0,0),0);
      },()=>{
        pageLoader.remove();
        this.setState({loadingData : false, pageLoadError : true});
      });
    }

  },
  shouldComponentUpdate(){
    return !this.loadingData;
  },
  render: function() {
    const {pageLoadError} = this.state;
    return (
      <div className="body-wrap">
        {pageLoadError ?  (<div>Ooops some error occured while loading the page. Please try again</div>) : this.props.children}
      </div>
    );
  }
});



App = connect(function(state){
  return {
    state
  }
},function(dispatch){
  return {
    dispatch : dispatch
  }
})(App);

module.exports = App;
