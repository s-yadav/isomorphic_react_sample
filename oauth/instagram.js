const InstagramStrategy = require('passport-instagram').Strategy;
const {DOMAIN} = require('../config/config');

// dev
// const InstagramConfig = {
//   'clientID': '1d9fe69186744757a46c580956b8511d', // App ID
//   'clientSecret': 'f7899204b3d44cca82585771e3fbef75', // App Secret
//   'callbackURL': DOMAIN+'/connect/instagram/callback'
// };

// production
const InstagramConfig = {
  'clientID': '8126ced06acd453c85338a9d4cb4aa18', // App ID
  'clientSecret': '7eaf84ff2a314a7894c0981bd4792e1b', // App Secret
  'callbackURL': DOMAIN+'/connect/instagram/callback'
};


module.exports = {
  init: function(passport) {
    passport.use(new InstagramStrategy(InstagramConfig,
      function(accessToken, refreshToken, profile, cb) {
        cb(null, {accessToken,refreshToken, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/instagram', passport.authenticate('instagram'));

    // handle the callback after instagram has authenticated the user
    app.get('/connect/instagram/callback',
      passport.authenticate('instagram'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'instagram'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/instagram/update_server',function(req,res){
          const {accessToken,refreshToken, profile} = req.user;
          //make api call to server to save info
          //
          res.json({accessToken, socialId: ''+profile.id});
      });
  }
}
