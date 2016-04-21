var el = require('../dom.js').el;

module.exports = function () {
  var header = el('div', 'header');
  header.textContent = 'Lexponential';
  return header;
};

