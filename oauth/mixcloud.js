const MixcloudStrategy = require('passport-mixcloud').Strategy;
const {DOMAIN} = require('../config/config');

// dev
// const MixcloudConfig = {
//   'clientID': 'KqPEHhHGZBfV5uLzEc', // App ID
//   'clientSecret': 'ddURGvyVTR8Sm7KvWeeDCqgJgkrHSAwN', // App Secret
//   'callbackURL': DOMAIN+'/connect/mixcloud/callback'
// };

// production
const MixcloudConfig = {
  'clientID': 'uGBLGN7U5sVZGjTdSY', // App ID
  'clientSecret': '8EZYr7aW8fWWBn4eNQQ87kZhE62x9RJv', // App Secret
  'callbackURL': DOMAIN+'/connect/mixcloud/callback'
};


module.exports = {
  init: function(passport) {
    passport.use(new MixcloudStrategy(MixcloudConfig,
      function(accessToken, refreshToken, profile, cb) {
        cb(null, {accessToken,refreshToken, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/mixcloud', passport.authenticate('mixcloud'));

    // handle the callback after mixcloud has authenticated the user
    app.get('/connect/mixcloud/callback',
      passport.authenticate('mixcloud'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'mixcloud'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/mixcloud/update_server',function(req,res){
          const {accessToken, profile} = req.user;

          //make api call to server to save info
          res.json({accessToken, socialId: profile.username});
      });
  }
}
