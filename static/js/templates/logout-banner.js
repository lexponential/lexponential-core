var el = require('../dom.js').el;

module.exports = function (onclickCB) {
  var banner = el('div', 'logout-banner');
  var bannerText = el('span');
  bannerText.innerText = 'logout';
  bannerText.addEventListener('click', onclickCB);
  banner.appendChild(bannerText);
  return banner;
};

