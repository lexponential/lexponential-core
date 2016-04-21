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

  var lock = new Auth0Lock('J0tgrJBTPGNCIG6zVHDIYBTkaemFAkTT', 'lukedavis.auth0.com');

  this.login = function () {
    lock.show({ authParams: { scope: 'openid' } });
  };

  this.parseHash = function () {
    var hash = lock.parseHash(window.location.hash);
    if (hash) {
      if (hash.error) {
        console.log("There was an error logging in", hash.error);
        alert('There was an error: ' + hash.error + '\n' + hash.error_description);
      } else {
        //save the token in the session:
        localStorage.setItem('id_token', hash.id_token);
      }
    }
  };

  this.getUser = function () {
    //retrieve the profile:
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error geting the profile: ' + err.message);
        }
        console.log(profile);
      });
    }
  };

  this.getLexemes = function (callback) {
    var url = config.baseURL + '/lexemes';
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .header("Authorization", "Bearer " + localStorage.getItem('id_token'))
      .get(function(err, rawData){
        if (err) console.log(err);
        var res = JSON.parse(rawData.responseText);
        state.lexemes = res.lexemes;
        console.log("got response", state.lexemes);
      });
    /*
    // xhr GET with authorization set to our credentials
      var req = new XMLHttpRequest();
      req.onReadyStateChange = success; 
      req.open('GET', url, true);
      req.responseType = 'json';
      req.setRequestHeader(
          'Authorization',
          'Bearer ' + localStorage.getItem('id_token')
          );
      req.send();    

    function success () {
      console.log('success!');
      console.log(arguments);
      if (req.readyState === 4 && req.status === 200) {
        var data = JSON.parse(req.responseText);
        lexemes.concat(data.lexemes);
        callback();
      } else {
        failure();
      }
    };

    function failure () {
      console.log('failure');
    };
    */
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
