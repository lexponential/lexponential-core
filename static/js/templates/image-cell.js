var el = require('../dom.js').el;

module.exports = function (imageNode, imageTitle) {
  var cell = el('div', 'image-cell');
  cell.appendChild(imageNode);

  var title = el('p', 'image-title');
  title.textContent = imageTitle || 'Lightbox Demo Title';
  cell.appendChild(title);
  return cell;
};

