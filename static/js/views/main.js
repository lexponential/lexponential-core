var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  inputArea: require('../templates/input-area.js'),
  logoutBanner: require('../templates/logout-banner.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.logoutBanner(function () {
        coreLogic.logout();
        routes.logout();
      }),
      t.inputArea(coreLogic)
  );
};

module.exports = main;
