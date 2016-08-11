'use strict';
const express = require('express');
const proxy = require('proxy-middleware');
const url = require('url');
const React = require('react');
const ReactDomServer = require('react-dom/server');
const Router = require('react-router');
const {Provider} = require('react-redux');
const {match, RouterContext} = Router;
const cookieParser = require('cookie-parser');
const compress = require('compression');
const {PORT,S3_BUCKET} = require('./config/config');
const helmet = require('helmet');

const auth = require('http-auth');

//to throw uncaught exception error
process.on('uncaughtException',  (exception) => {
  console.log(exception);
  // console.log("\033[31m"+JSON.stringify(exception)+"\033[0m");
  // console.log("\033[31m"+exception.stack+"\033[0m");
  console.log(JSON.stringify(exception));
  console.log(exception.stack);
});


function requireHTTPS(req, res, next) {
		let redirectUrl;
		if (req.protocol !== 'https' && req.get('host') && req.get('host').indexOf('domain.com') !== -1) {
				//FYI this should work for local development as well
				redirectUrl = 'https://' + req.get('host') + req.url;
		}
		//redirect www to root url
		if (req.get('host') && req.get('host').match(/^www/) !== null ) {
			redirectUrl = 'https://' + req.get('host').replace(/^www\./, '') + req.url;
  	}

		if(redirectUrl){
			res.redirect(redirectUrl);
			return;
		}
		next();
}

function server(development){

  const app = express();

  // app.use(auth.connect(basic));

  app.use(cookieParser());
  //gzip response
	app.use(compress());

	app.enable('trust proxy');
	app.use(requireHTTPS);
	app.use(helmet());

  let devScripts = "";
  const cachetime = 0;
  let cdnSrc ="";

  let manifestScript = '';

  const webpackManifest = require('./webpack-manifest/manifest.json');

  if(process.env.NODE_ENV === "development"){
    // proxy the request for static assets
    app.use('/public/js/', proxy(url.parse('http://localhost:8081/public/js/')));
    devScripts = (`<script src="//cdn.jsdelivr.net/sockjs/1.0.3/sockjs.min.js"></script>`);
  }
  else{
    app.use("/public/js/", express.static(__dirname + "/public/js/", {maxAge: cachetime}));
    cdnSrc = `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react.min.js"></script>
	            <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.1/react-dom.min.js"></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/react-router/2.0.0-rc5/ReactRouter.min.js"></script>
              <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>`;

    const webpackChunkManifest = JSON.stringify(require('./webpack-manifest/chunk-manifest.json'));
    manifestScript = `<script>
      /*** webpack menifest data ***/
      var webpackManifest = ${webpackChunkManifest}
    </script>`;

  }

  app.use("/public/css/", express.static(__dirname + "/public/css/", {maxAge: cachetime}));
  app.use("/public/fonts/", express.static(__dirname + "/public/fonts/", {maxAge: cachetime}));
  app.use("/public/images/", express.static(__dirname + "/public/images/", {maxAge: cachetime}));

  /*** handle social connects oauth ***/
  const passport = require('passport');
  const session = require('express-session');

  app.use(session({
    secret : 'SECRETZF6784'
  }));

  /*** handle social connects oauth end***/
  const routes = require('./shared/routes');
  const {createAppStore} = require('./server/store');
  const pageState = require('./server/page_state');
  const {isRedirectionRequired} = require('./shared/redirects');


  app.use((req, res) => {

    const store = createAppStore(req.url);

    //load initial state
    pageState.load(req,store).then(() => {
          // console.log('data',arguments);

          const storeState = store.getState();



          //check if redirection required
          const redirectTo = isRedirectionRequired(storeState);
          if(redirectTo){
            res.redirect(redirectTo);
            return;
          }

          const appState = JSON.stringify(storeState);

          match({
            routes, location: req.url
          }, (error, redirectLocation, renderProps) => {
            console.log(error);
            if(error) {res.status(500).send(error.message)} else if (redirectLocation) {res.redirect(302, redirectLocation.pathname + redirectLocation.search)}
            else if (renderProps) {
                console.log('react string');
                let reactString;

                try{
                  reactString = ReactDomServer.renderToString(
                  <Provider store={store}>
                    <RouterContext {...renderProps}/>
                  </Provider>
                  );
                }
                catch(e){
                  console.log(e);
                  console.log(e.stack);
                  res.status(500).send(e.stack);
                  return;
                }

								let meta = [];
								reactString = reactString.replace(/<div[^<>]*class="page-meta-to-be-moved"[^<>]*>((.|\n)*?)<\/div>/g,function($1,$2){
									meta.push($2);
									return "";
								});

								meta = meta.join('').replace(/data-react-id=".*?"/g,'');
								const isTitlePresent = meta.match(/<title[^<>]*>((.|\n)*?)<\/title>/);
                const appCss = webpackManifest['app.css'];
                const template = (
        						`<!doctype html>
                    <html lang="en-us">
                    <head>
                      <meta charSet="utf-8"/>`+
                      (isTitlePresent ? '' : '<title>ISOMORPHIC SAMPLE</title>')+
											`${meta}
										<link rel="shortcut icon" href="/public/images/favicon.ico"/>
                    <link rel="stylesheet" type="text/css" href="/public/js/${webpackManifest['app.css']}">
                      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
                    </head>
                    <body>
                      <div id="fb-root"></div>
                      <div id="content" onclick="void(0);">${reactString}</div><!--Required to handle event bubbling of click in ios safari -->
                      ${manifestScript}
											${cdnSrc}
                      ${devScripts}
                      <script type="application/json" id="initialData">
                        ${appState}
                      </script>
                      <script src="/public/js/${webpackManifest['common.js']}"></script>
                      <script src="/public/js/${webpackManifest['app.js']}"></script>
                    </body>
                  </html>`
        				);
              res.status(200).send(template)
            } else {
              console.log('not matching');
              res.status(301).redirect('/')
            }
          });
    },(data) => {
      res.redirect('/');
      // if(data.redirectTo){
      //
      // }
    });
  });


  app.listen(PORT,() =>{
    console.log('App running on localhost:'+PORT);
  });

  return app;
}
module.exports = server;
