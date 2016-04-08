var el = require('../dom.js').el;

module.exports = function (imageTitle) {
  var title = el('p');
  title.textContent = imageTitle || 'Lightbox Demo Title';
  return title;
};

