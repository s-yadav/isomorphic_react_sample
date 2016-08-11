const TwitterStrategy = require('passport-twitter').Strategy;
const {DOMAIN} = require('../config/config');

// dev
// const twitterConfig = {
//     consumerKey: 'OihfQF1N2Az08SrpkhGOW7AxP',
//     consumerSecret: 'V4Pcv99z3SzfqXWW01FPKM8fHMFHDuSL20Ls5UiIUZqVQe4qA3',
//     'callbackURL': DOMAIN+'/connect/twitter/callback'
// };

// production
const twitterConfig = {
    consumerKey: 'j85xBHWQyGFhFh6arrzqrmn8T',
    consumerSecret: 'fyVTpwNTbqI8DqrJraVuzlTrjTh7dOKs1UF3H77nyDVTHVeBOI',
    'callbackURL': DOMAIN+'/connect/twitter/callback'
};

module.exports = {
  init: function(passport) {
    passport.use(new TwitterStrategy(twitterConfig,
      function(token, tokenSecret, profile, cb) {
        cb(null,{token,tokenSecret, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/twitter', passport.authenticate('twitter'));

    // handle the callback after facebook has authenticated the user
    app.get('/connect/twitter/callback',
     passport.authenticate('twitter'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'twitter'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/twitter/update_server',function(req,res){
          const {token,tokenSecret, profile} = req.user;
          //make api call to server to save info
          //
          const newData = {
            socialId: profile.id,
            accessToken: token,
            accessTokenSecret: tokenSecret
          };
          res.json(newData);
      });
  }
}
