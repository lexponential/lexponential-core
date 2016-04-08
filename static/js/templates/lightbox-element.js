var el = require('../dom.js').el;

module.exports = function(className, textContent, callback) {
  var button = el('div', className);
  button.textContent = textContent;
  button.addEventListener('click', callback);
  return button;
};

