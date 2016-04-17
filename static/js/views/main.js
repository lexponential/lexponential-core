var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  inputArea: require('../templates/input-area.js')
};

var main = function (coreLogic) {
  append(document.body, t.header(), t.inputArea(coreLogic));
};

module.exports = main;
