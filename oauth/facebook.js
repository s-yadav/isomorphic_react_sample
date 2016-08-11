const FacebookStrategy = require('passport-facebook').Strategy;
const {DOMAIN} = require('../config/config');

// dev
// const facebookConfig = {
//   'clientID': '1627209377544004', // App ID
//   'clientSecret': '925cdf01deae664192cec1f0eb2907a3', // App Secret
//   'callbackURL': DOMAIN+'/connect/facebook/callback'
// };

// production
const facebookConfig = {
  'clientID': '950780301696234', // App ID
  'clientSecret': '81dbb9477ed967e02e14ce6fe8687996', // App Secret
  'callbackURL': DOMAIN+'/connect/facebook/callback'
};

module.exports = {
  init: function(passport) {
    passport.use(new FacebookStrategy(facebookConfig,
      function(accessToken, refreshToken, profile, cb) {
        cb(null, {accessToken, refreshToken, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/facebook', passport.authenticate('facebook', {
      scope: ['email', 'manage_pages']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/connect/facebook/callback',
      passport.authenticate('facebook'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'facebook'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/facebook/update_server',function(req,res){
          const {accessToken,refreshToken, profile} = req.user;
          res.json({accessToken, socialId: ''+profile.id, userName: profile.displayName});
      });
  }
}
