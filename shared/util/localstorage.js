let ls;

try{
  ls = localStorage
}
catch(e){
  ls = {};
}


const localStorageUtil = {
  /**
    expTime : inseconds
  **/
  set : function(key, value, expTime){
    const currentTime = Date.now() / 1000;
    const lsData = {
      updatedTime : currentTime,
      data : value
    }

    //add expiry time if given
    if(expTime){
      lsData.expireOn = currentTime + expTime;
    }

    ls[key] = JSON.stringify(lsData);
  },
  get : function(key, metaInfo){
    let lsData = ls[key];
    try{
      lsData = JSON.parse(lsData);
    }
    catch(e){
      lsData = {
        data : lsData
      }
    }

    //delete the data if expiry was defined and its expired
    if(lsData.expireOn && lsData.expireOn < (Date.now()/1000)){
      localStorageUtil.delete(key);
      return undefined;
    }

    //if asked for meta information return whole obj or else return only data
    return metaInfo ? lsData : lsData.data;
  },

  delete : function(key){
    if(ls[key]) delete ls[key];
  }
};

module.exports = localStorageUtil;
