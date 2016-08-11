const SoundcloudStrategy = require('passport-soundcloud').Strategy;
const {DOMAIN} = require('../config/config');

// dev
// const SoundcloudConfig = {
//   'clientID': 'a11a5f0f9b29210c09d65e800183fc74', // App ID
//   'clientSecret': '63a76a0581b176e4784c32fde9d4e6a4', // App Secret
//   'callbackURL': DOMAIN+'/connect/soundcloud/callback'
// };

// staging
// const SoundcloudConfig = {
//   'clientID': '9d7a8df4e3b6a5b45e27b167701020c8', // App ID
//   'clientSecret': 'f25f62dd7048777862424bd90ec24a2a', // App Secret
//   'callbackURL': DOMAIN+'/connect/soundcloud/callback'
// };

// production
const SoundcloudConfig = {
  'clientID': 'c9b6d4d663a7bc5d6bcb294c03953092', // App ID
  'clientSecret': '1a10a554eed58da27ffc12be1fb62a52', // App Secret
  'callbackURL': DOMAIN+'/connect/soundcloud/callback'
};


module.exports = {
  init: function(passport) {
    passport.use(new SoundcloudStrategy(SoundcloudConfig,
      function(accessToken, refreshToken, profile, cb) {
        cb(null, {accessToken,refreshToken, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/soundcloud', passport.authenticate('soundcloud'));

    // handle the callback after soundcloud has authenticated the user
    app.get('/connect/soundcloud/callback',
      passport.authenticate('soundcloud'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'soundcloud'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/soundcloud/update_server',function(req,res){
          const {accessToken,refreshToken, profile} = req.user;
          //make api call to server to save info
           const newData = {
            socialId: '' + profile.id,
            userName: profile.displayName,
            accessToken,
            refreshToken
          };
          res.json(newData);
      });
  }
}
