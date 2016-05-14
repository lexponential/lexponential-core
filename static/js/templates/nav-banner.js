var domTools = require('../dom.js');
var append = domTools.append;
var el = domTools.el;

module.exports = function (coreLogic, routes) {
  var banner = el('div', 'nav-banner');
  
  var logout = el('span');
  logout.innerText = 'logout';
  logout.addEventListener('click', function () {
    coreLogic.logout();
    routes.logout();
  });

  var enterText = el('span');
  enterText.innerText = 'enter text';
  enterText.addEventListener('click', function () {
    routes.main();
  });

  var dashboard = el('span');
  dashboard.innerText = 'dashboard';
  dashboard.addEventListener('click', function () {
    routes.dashboard();
  });

  var languages = el('span');
  languages.innerText = 'languages';
  languages.addEventListener('click', function () {
    routes.languages();
  });

  var flashcards = el('span');
  flashcards.innerText = 'flashcards';
  flashcards.addEventListener('click', function () {
    routes.flashcards();
  });

  append(banner, languages, enterText, flashcards, dashboard, logout);
  
  return banner;
};

