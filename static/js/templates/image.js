var el = require('../dom.js').el;

module.exports = function (src, id) {
  var img = el('img');
  img.setAttribute('id', id);
  img.setAttribute('src', src);
  return img;
};

