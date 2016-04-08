var uuid = require('../uuid.js');
var el = require('../dom.js').el;
var append = require('../dom.js').append;

var t = {
    graphNode: function (node, coreLogic) {
        var n = el('div', 'edutomic-node');
        n.innerText = node.value;
        return n;
    },

    button: function (innerText, onclick) {
        var b = el('button');
        b.addEventListener('click', onclick);
        b.innerText = innerText;
        return b;
    }
};

module.exports = function (coreLogic) {
    var graph = el('div', 'edutomic-graph'); 
    var addNodeButton = t.button('Add Node', addNode);
    append(graph, addNodeButton);

    var nodes = coreLogic.getNodes();

    for (var i = 0; i < nodes.length; i++) {
        append(graph, t.graphNode(nodes[i], coreLogic));
    }

    function addNode() {
        var node = coreLogic.addNode(uuid());
        var gNode = t.graphNode(node, coreLogic);
        append(graph, gNode);
    };

    return graph;
};

