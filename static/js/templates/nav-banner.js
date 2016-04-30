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
  
  var table = el('span');
  table.innerText = 'lexeme table';
  table.addEventListener('click', function () {
    routes.tableView();
  });
  
  var enterText = el('span');
  enterText.innerText = 'enter text';
  enterText.addEventListener('click', function () {
    routes.main();
  });

  append(banner, enterText, table, logout);
  
  return banner;
};

