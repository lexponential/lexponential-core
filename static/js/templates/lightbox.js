var append = require('../dom.js').append;
var el = require('../dom.js').el;

var t = {
  lightboxElement: require('./lightbox-element.js'),
  lightboxTitle: require('./lightbox-title.js')
};

module.exports = function (imageTitle, imageNode, closeCallback) {
  var lightbox = el('div', 'lightbox');
  var close = t.lightboxElement('lightbox-close', 'X', closeCallback);
  var title = t.lightboxTitle(imageTitle);
  append(lightbox, close, imageNode, title);
  return lightbox;
};

