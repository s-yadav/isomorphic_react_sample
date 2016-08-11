const { combineReducers, applyMiddleware, compose, createStore } = require('redux');
const { syncHistory, routeReducer } = require('react-router-redux');
const routes = require('../shared/routes');
const rootReducers = require('../shared/reducers');
const thunk = require('redux-thunk');
const {browserHistory} = require('react-router');
const $ = require('jquery');

// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below
const reducer = combineReducers({
  routing: routeReducer,
  app: rootReducers, //you can combine all your other reducers under a single namespace like so
});


const reduxRouterMiddleware = syncHistory(browserHistory);

// Compose reduxReactRouter with other store enhancers
const createStoreWithMiddleware = applyMiddleware(thunk,reduxRouterMiddleware)(createStore);

let initialData = {};

try{
  initialData = JSON.parse($('#initialData').html());
}
catch(e){
  // console.log('No initial data found');
}

const store = createStoreWithMiddleware(reducer,initialData);

module.exports = store;
