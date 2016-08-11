const $ = require('jquery');
(function() {
  $('body').on('click', '.stop-propagation', (e)=> {
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}());
