var domTools = require('../dom.js');
var append = domTools.append;
var remove = domTools.remove;

var t = {
  header: require('../templates/header.js'),
  graph: require('../templates/edutomic-graph.js')
};

var main = function (coreLogic) {
  append(document.body, t.header(), t.graph(coreLogic));
};

module.exports = main;
