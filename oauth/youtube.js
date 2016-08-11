const YoutubeStrategy = require('passport-youtube-v3').Strategy;
const {DOMAIN} = require('../config/config');

// dev
//API KEY APIKey: AIzaSyAep-CQyYgYzL8mkOVrqpbe8F_eOyro5q0
// const youtubeConfig = {
//   'clientID': '882473948507-rtsl1q8gmqfvb8tre2e21ude0aqvdai8.apps.googleusercontent.com', // App ID
//   'clientSecret': 'W--iTw3wPP_dpPn7c-5mA2Aa', // App Secret
//   'callbackURL': DOMAIN+'/connect/youtube/callback',
//   'scope': ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtubepartner-channel-audit']
// };

// production
const youtubeConfig = {
  'clientID': '869908601963-c66cc8neshqjaedm3i304f7gteek80dk.apps.googleusercontent.com', // App ID
  'clientSecret': 'vcZUQqE88mgwecB1CS_0BL0Q', // App Secret
  'callbackURL': DOMAIN+'/connect/youtube/callback',
  'scope': ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtubepartner-channel-audit']
};

module.exports = {
  init: function(passport) {
    passport.use(new YoutubeStrategy(youtubeConfig,
      function(accessToken, refreshToken, profile, cb) {
        cb(null, {accessToken,refreshToken, profile});
      }
    ));
  },
  route: function(app, passport) {
    app.get('/connect/youtube', passport.authenticate('youtube'));

    // handle the callback after instagram has authenticated the user
    app.get('/connect/youtube/callback',
      passport.authenticate('youtube'),
      function(req, res) {
        // Successful authentication, redirect home.
        res.send(`
            <html>
              <body>
                <script>
                  if (window.opener != null && !window.opener.closed) {
                      if(window.opener.handleSocialConnect){
                        window.opener.handleSocialConnect({
                          accountType : 'youtube'
                        });
                      }
                      window.close();
                  }
                </script>
              </body>
            </html>
          `);
      });

      app.get('/connect/youtube/update_server',function(req,res){
          const {accessToken,refreshToken, profile} = req.user;
          //make api call to server to save info
          //
          res.json({accessToken,refreshToken, userName: profile.displayName});
      });
  }
}
