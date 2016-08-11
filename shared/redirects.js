const publicPages = ["/public"];

publicPages.push("/uploadImage");
publicPages.push("/viewStats");

const UrlPattern = require('url-pattern');

function authRedirect(currentPage, sessionData) {
  const profileInfo = sessionData.profileInfo;
  const token = sessionData.token;
  let pattern;

  //handle public pages
  for (let i = 0, ln = publicPages.length; i < ln; i++) {
    pattern = new UrlPattern(publicPages[i],{segmentValueCharset : 'a-zA-Z0-9-_~ %.@'});
    // console.log(currentPage, pattern.match(currentPage));
    if (pattern.match(currentPage)) return;
  }

  if (currentPage !== "/" && !token) {
    return "/";
  }
}

/**
 * Function to find if redirection is required given a state info
 * @param  {[type]}  state [description]
 * @return {Boolean}       [description]
 */
function isRedirectionRequired(state) {
  const currentPage = state.routing.location.pathname;

  //check if auth redirection required
  //const isAuthRedirectReq = authRedirect(currentPage, state.app.auth.userData || {});
  //if (isAuthRedirectReq) return isAuthRedirectReq;

  return false;
}

module.exports = {
  authRedirect,
  isRedirectionRequired
}
