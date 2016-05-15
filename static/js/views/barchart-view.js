var domTools = require('../dom.js');
var append = domTools.append;

var t = {
  header: require('../templates/header.js'),
  navBanner: require('../templates/nav-banner.js'),
  barChart: require('../templates/barchart.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.navBanner(coreLogic, routes),
      t.barChart(coreLogic.getLexemes)
  );
};

module.exports = main;
