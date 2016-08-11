const { combineReducers, applyMiddleware, createStore } = require('redux');
const {createMemoryHistory} =  require('react-router');
const { syncHistory, routeReducer } = require('react-router-redux');
const routes = require('../shared/routes');
const rootReducers = require('../shared/reducers');
const thunk = require('redux-thunk');

// Configure reducer to store state at state.router
// You can store it elsewhere by specifying a custom `routerStateSelector`
// in the store enhancer below

const reducer = combineReducers({
  routing: routeReducer,
  app: rootReducers, //you can combine all your other reducers under a single namespace like so
});

const createAppStore = function(url){

  const history = createMemoryHistory(url);
  const reduxRouterMiddleware = syncHistory(history);

  // Compose reduxReactRouter with other store enhancers
  const createStoreWithMiddleware = applyMiddleware(thunk,reduxRouterMiddleware)(createStore);

  const store = createStoreWithMiddleware(reducer);

  return store;
}

module.exports = {createAppStore};
