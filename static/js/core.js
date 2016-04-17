var config = require('./config.js');

function deepCopy (obj) {
    return JSON.parse(JSON.stringify(obj));
};

function Node (nodeValue) {
    this.value = nodeValue;
};

function Edge (from, to) {
    this.from = from;
    this.to = to;
};

module.exports = function () {
    var state = {
        nodes: [],
        edges: [],
        lexemes: []
    };

    this.getLexemes = function () {
        return deepCopy(state.lexemes);
    };

    this.addLexeme = function (lexeme) {
        url = config.baseURL + '/lexemes/create';
        var data = JSON.stringify({lexemes: lexeme});
        d3.xhr(url)
            .header("Content-Type", "application/json")
            .post(data, function(err, rawData){
                if (err) console.log(err);
                var res = rawData;
                console.log("got response", res);
                state.lexemes.push(lexeme);
             });
    };

    this.getNodes = function () {
        return deepCopy(state.nodes);
    };

    this.getEdges = function () {
        return deepCopy(state.edges);
    };

    this.addNode = function (nodeValue) {
        var node = new Node(nodeValue);
        state.nodes.push(node);

        var url = config.baseURL + '/nodes/create';
        var data = JSON.stringify({value: node.value});
        d3.xhr(url)
            .header("Content-Type", "application/json")
            .post(data, function(err, rawData){
                if (err) console.log(err);
                console.log("got response", rawData);
             });

        return node;
    };

    this.addEdge = function (fromNodeID, toNodeID) {
        var edge = new Edge(from, to);
        state.edges.push(edge);
        return edge;
    };
};
