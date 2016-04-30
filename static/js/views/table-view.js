var domTools = require('../dom.js');
var append = domTools.append;

var t = {
  header: require('../templates/header.js'),
  logoutBanner: require('../templates/logout-banner.js'),
  table: require('../templates/table.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.logoutBanner(function () {
        coreLogic.logout();
        routes.logout();
      }),
      t.table(coreLogic.getLexemes)
  );
};

module.exports = main;
