const $ = require('jquery');
const React = require('react');

module.exports = {
  clone: function clone(data, deep) {
    const type = Object.prototype.toString.call(data);
    if (type === '[object Array]') {
      return $.extend(deep, [], data);
    } else if (type === '[object Object]') {
      return $.extend(deep, {}, data);
    }
  },
  addZero: function(num) {
    return (num < 10) ? ('0' + num) : num;
  },
  sortByKey: function sortByKey(array, key, reverse = false) {
    return array.sort((a, b) => {
      let x, y;
      if (typeof key === 'object') {
        x = key.map((item) => this.addZero(a[item])).join('');
        y = key.map((item) => this.addZero(b[item])).join('');
      }
      else {
        x = a[key];
        y = b[key];
      }
      return reverse ? ((x > y) ? -1 : ((x < y) ? 1 : 0)) : ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  },
  toTitleCase: function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt)=> {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  join: function join(ary,joinDelmiter){
    if(typeof joinDelmiter == "string") return ary.join(joinDelmiter);
    else if(typeof joinDelmiter == "function"){
      let str = "";
      ary.forEach((item, idx) => {
        str += joinDelmiter(item,idx)+item;
      });
      return str;
    }
  },
  reactNl2br: function reactNl2br(str){
    if (!str) return [];
    const  strAry= str.split('\n');
    for(let i=0;i<strAry.length; i++ ){
      strAry.splice(i+1,0,<br key={i}/>);
      i++
    }
    return strAry;
  },
  dataURItoBlob : function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(dataURI.split(',')[1]);
        }
      else{
          byteString = unescape(dataURI.split(',')[1]);
        }

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
  },
  getLocation : function getLocation(href) {
      const match = href.match(/^(https?:)\/\/(([^:\/?#]*)(?::([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
      return match && {
          protocol: match[1],
          host: match[2],
          hostname: match[3],
          port: match[4],
          pathname: match[5],
          search: match[6],
          hash: match[7]
      }
  },
  debounce : function(callback, delay){
    let timeout;
    return function(){
      const args = Array.prototype.slice.call(arguments);
      if(timeout) clearTimeout(timeout);
      timeout = setTimeout(()=>{
        callback.apply(this,args);
      }, delay || 100);
    }
  },
  findIndexWithKey : function(ary, obj, key){
    for(let i=0,ln=ary.length; i<ln; i++){
      if(obj[key] === ary[i][key]){
        return i;
      }
    }
    return -1;
  }
}
