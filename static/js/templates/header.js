var el = require('../utils/dom.js').el;

module.exports = function () {
  var header = el('div', 'header');
  header.textContent = 'LEXPONENTIAL';
  return header;
};

