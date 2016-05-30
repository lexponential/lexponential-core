var domTools = require('../utils/dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  loginBanner: require('../templates/login-banner.js')
};

var main = function (coreLogic) {
  append(
      document.body,
      t.header(),
      t.loginBanner(coreLogic.login)
  );
};

module.exports = main;
