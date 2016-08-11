module.exports = {
  name : function(name){
    return name && name.length > 1;
  },
  email : function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email && re.test(email);
  },
  password : function(password){
    return password && password.length >= 6;
  },
  //Rgex to check only for numbers
  numeric : function(value){
    var regex = /(^$)|(^\d+$)/;
      return value && regex.test(value);
  }
}
