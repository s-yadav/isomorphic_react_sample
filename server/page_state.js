const {load} = require('../shared/routes/load_page_state');
const {bindActionCreators} = require('redux');
const UrlPattern = require('url-pattern');
const $def = require('../shared/util/deferred');

function parseJson(jsonStr){
  let json;
  try{
    json = JSON.parse(jsonStr);
  }
  catch(e){
    json = null;
  }
  return json;
}

function loadAuthState(store, cookies){
  let sessionData;
  try{
    sessionData = parseJson(decodeURIComponent(cookies._sd));
  }
  catch(err){
    sessionData = parseJson(cookies._sd);
  }

  if(sessionData){
    //store.dispatch(authActions.setSessionData(sessionData));
  }

  return sessionData;
}

function getOtherCookieInfo(store, cookies){
  const data = parseJson(cookies.mykey);
  if(data){
    store.dispatch(someAction.setInitialData(data));
  }
}

function loadPageState(req,store){

  //load auth state
  const sessionData = loadAuthState(store, req.cookies) || {};

  //load any other data from session
  // getOtherCookieInfo(store, req.cookies);

  const defer = $def.defer();

  load( req.url, null, store.dispatch, sessionData).then(defer.resolve,defer.reject);

  return defer.promise();
}

module.exports ={
  load : loadPageState
};
