function setCookie(cname, cvalue, extime) {
    cvalue = encodeURIComponent(cvalue);
    var expires = "";
    if(extime){
      var d = new Date();
      d.setTime(d.getTime() + (extime*1000));
      expires= "expires="+d.toUTCString();
    }
    document.cookie = cname + "=" + cvalue + ";path=/; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length));
    }
    return "";
}


function deleteCookie(cname) {
  document.cookie = cname+"=;path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

module.exports = {
  get : getCookie,
  set : setCookie,
  delete : deleteCookie
}
