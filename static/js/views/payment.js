var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  paymentStripe: require('../templates/payment-stripe.js')
  navBanner: require('../templates/nav-banner.js')
};

var main = function (coreLogic, routes) {
  append(
      document.body,
      t.header(),
      t.navBanner(coreLogic, routes),
      t.paymentStripe(coreLogic, routes)
  );
};

module.exports = main;
