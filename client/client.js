const ReactDOM = require("react-dom"),
    React = require("react"),
    { syncHistory, routeReducer } = require('react-router-redux'),
    {Route,Router,browserHistory} = require("react-router"),
    {Provider} = require("react-redux"),
    store = require("./store"),
    routes = require('../shared/routes'),
    cookie = require('../shared/util/cookie');

    require('./base');

const dest = document.getElementById('content');

//require.ensure('./base');

const rootInstance = ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>
, dest);

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}

if (module.hot) {
    const sock = new SockJS('http://localhost:8082/socket_channel');
    sock.onopen = function() {
        sock.send('test');
    };
    sock.onmessage = function(e) {
        if(e.data == "reload-css"){
          Array.prototype.slice.call(document.styleSheets).forEach(function (sheet) {
              if ((sheet.href || "").indexOf('localhost') !== -1) {
                  sheet.ownerNode.href = sheet.href.split('?')[0] + '?' + Math.ceil(Math.random()*10000);
              }
          });
        }
    };
    sock.onclose = function() {
    };
}
