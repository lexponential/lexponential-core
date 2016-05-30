var domTools = require('../utils/dom.js');
var append = domTools.append;

var t = {
  header: require('../templates/header.js'),
  navBanner: require('../templates/nav-banner.js'),
  languageSelection: require('../templates/language-selection.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.navBanner(coreLogic, routes),
      t.languageSelection(coreLogic, routes)
  );
};

module.exports = main;
