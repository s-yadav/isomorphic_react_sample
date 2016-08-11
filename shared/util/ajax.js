const $def = require('./deferred');
const request = require('superagent');
const ls = require('./localstorage');
const cookie = require('./cookie');
const $ = require('jquery');

const {API} = require('../config');

// a custom ajax method
function ajax(config){
  const defer = $def.defer();

  if(config.dispatch){
    config.dispatch({
      type  : config.action,
      status : 'progress'
    });
  }

  const sendErrorRes = function(config,err){
    if(config.error){
      config.error(err);
    }
    if(config.dispatch){
      config.dispatch({
        type  : config.action,
        status : 'error',
        data : err
      });
    }
    defer.reject(err);
  }

  const sendSuccessRes = function(config, data){
    if(config.success){
      config.success(data);
    }

    if(config.dispatch){
      config.dispatch({
        type  : config.action,
        status : 'success',
        data : data
      });
    }

    defer.resolve(data);
  }

  const xhr = request[config.method || 'get'](config.url)
    .set(Object.assign({},{'Content-Type': 'application/json', 'Accept': 'application/json'},config.headers))
    .query(config.query)
    .send(JSON.stringify(config.data))
    .end(function(err,res){
      //handle error
      //
      if(err){
        sendErrorRes(config, res ? res.body : {message : 'Internal Server Error'});
        return;
      }

      sendSuccessRes(config, res.body);
      
    });

    const promise = defer.promise();
    promise.abort = xhr.abort.bind(xhr);

    return promise;
}

// a custom ajax method for post
function ajaxPost(config){

  config = Object.assign({},config,{method :"post"});
  return ajax(config);
}

// a custom ajax method for get
function ajaxGet(config){
  config = Object.assign({},config,{method :"get", query: config.data, data:null});
  return ajax(config);
}

function getToken(){
  let sessionData;
  try{
    sessionData = JSON.parse(cookie.get('_sd'));
  }
  catch(e){
    sessionData = {token : null};
  }
  return sessionData.token;
}

// a custom ajax method for post
function ajaxPostWithToken(config){
  const token = config.token || getToken();
  config = Object.assign({},config,{method :"post",headers : {}});
  if(token) config.headers.token = token;
  return ajax(config);
}

function ajaxDeleteWithToken(config){
  config = Object.assign({},config,{method :"delete",data: config.data, headers : {token : config.token || getToken()}});
  return ajax(config);
}

function ajaxGetWithToken(config){
  const token = config.token || getToken();
  config = Object.assign({},config,{method :"get", query: config.data, data:null ,headers : {}});
  if(token) config.headers.token = token;
  return ajax(config);
}


function ajaxClient(config){
  const headers = Object.assign({},{'Accept': 'application/json'},config.headers)

  config.ajaxConfig = config.ajaxConfig || {};

  if(config.ajaxConfig.contentType !== false && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const options = Object.assign({
    url : config.url,
    data : config.data,
    type : config.method || 'get',
    crossDomain : true,
    headers : headers,
    success : function(data){
      if(config.dispatch){
        config.dispatch({
          type  : config.action,
          status : 'success',
          data : data
        });
      }

      if(config.success){
        config.success(data);
      }
    },
    error : function(data){
        const err = data.responseJSON;
        if(config.dispatch){
          config.dispatch({
            type  : config.action,
            status : 'error',
            data : err
          });
          if(config.error){
            config.error(err);
          }
        }
    }
  },config.ajaxConfig)

  return $.ajax(options);
}


function ajaxFileUpload(config){

  config = Object.assign({},config,{method :"POST", data: config.data,headers : {token : config.token || getToken()} , ajaxConfig : {processData : false, contentType : false}});

  return ajaxClient(config);
}

module.exports = {
  ajaxPost,
  ajaxGet,
  ajaxPostWithToken,
  ajaxGetWithToken,
  ajaxDeleteWithToken,
  ajaxFileUpload
}
