var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  loginButton: require('../templates/login-button.js')
};

var main = function (coreLogic) {
  append(
      document.body,
      t.header(),
      t.loginButton(coreLogic.login)
  );
};

module.exports = main;
